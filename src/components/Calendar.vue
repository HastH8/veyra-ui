<script setup lang="ts">
import { computed, ref, watch, type HTMLAttributes } from "vue";
import { ChevronLeft, ChevronRight } from "@lucide/vue";
import { cn } from "../utils/cn";

const props = withDefaults(
    defineProps<{
        locale?: string;
        weekStartsOn?: 0 | 1;
        class?: HTMLAttributes["class"];
    }>(),
    {
        locale: "en-US",
        weekStartsOn: 1,
    },
);

const model = defineModel<Date | null>({ default: null });

const today = new Date();
const initialDate = model.value ?? today;
const viewDate = ref(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
const view = ref<"days" | "months" | "years">("days");

const viewYear = computed(() => viewDate.value.getFullYear());

const monthName = computed(() =>
    viewDate.value.toLocaleDateString(props.locale, { month: "long" }),
);

// 7 Jan 2024 is a Sunday
const weekdays = computed(() =>
    Array.from({ length: 7 }, (_, index) =>
        new Date(2024, 0, 7 + index + props.weekStartsOn)
            .toLocaleDateString(props.locale, { weekday: "short" })
            .slice(0, 2),
    ),
);

const days = computed(() => {
    const month = viewDate.value.getMonth();
    const offset = (new Date(viewYear.value, month, 1).getDay() - props.weekStartsOn + 7) % 7;

    return Array.from({ length: 42 }, (_, index) => new Date(viewYear.value, month, 1 - offset + index));
});

const months = computed(() =>
    Array.from({ length: 12 }, (_, index) =>
        new Date(2024, index, 1).toLocaleDateString(props.locale, { month: "short" }),
    ),
);

const yearPageStart = computed(() => Math.floor(viewYear.value / 12) * 12);

const years = computed(() =>
    Array.from({ length: 12 }, (_, index) => yearPageStart.value + index),
);

function isSameDay(a: Date | null, b: Date) {
    return !!a && a.toDateString() === b.toDateString();
}

function navigate(step: number) {
    const month = viewDate.value.getMonth();
    const yearStep = { days: 0, months: step, years: step * 12 }[view.value];

    viewDate.value = new Date(viewYear.value + yearStep, view.value === "days" ? month + step : month, 1);
}

function selectDay(day: Date) {
    model.value = day;
}

// keep the visible month in sync when the date is selected or changed from outside
watch(model, (value) => {
    if (!value) return;

    viewDate.value = new Date(value.getFullYear(), value.getMonth(), 1);
    view.value = "days";
});

function selectMonth(month: number) {
    viewDate.value = new Date(viewYear.value, month, 1);
    view.value = "days";
}

function selectYear(year: number) {
    viewDate.value = new Date(year, viewDate.value.getMonth(), 1);
    view.value = "months";
}

function cellClass(selected: boolean, current: boolean, muted = false) {
    if (selected) return "bg-inverse text-text-inverse font-semibold";
    if (muted) return "text-text-faint hover:bg-bg-muted";
    if (current) return "border border-border text-text-primary hover:bg-bg-muted";

    return "text-text-primary hover:bg-bg-muted";
}

const navButtonClass = "flex size-7 cursor-pointer items-center justify-center rounded-md text-text-faint transition-colors hover:bg-bg-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const headerButtonClass = "cursor-pointer rounded-md px-2 py-1 text-sm font-semibold capitalize transition-colors hover:bg-bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
const cellBaseClass = "flex cursor-pointer items-center justify-center rounded-md text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
</script>

<template>
    <div :class="cn('inline-flex flex-col gap-y-3 rounded-lg border border-border bg-bg-surface p-3', props.class)">
        <div class="flex items-center justify-between">
            <button type="button" aria-label="Previous" :class="navButtonClass" @click="navigate(-1)">
                <ChevronLeft class="size-4" />
            </button>

            <div class="flex items-center">
                <button v-if="view === 'days'" type="button" :class="headerButtonClass" @click="view = 'months'">
                    {{ monthName }}
                </button>

                <button v-if="view !== 'years'" type="button" :class="headerButtonClass" @click="view = 'years'">
                    {{ viewYear }}
                </button>

                <span v-else class="px-2 py-1 text-sm font-semibold">
                    {{ yearPageStart }} – {{ yearPageStart + 11 }}
                </span>
            </div>

            <button type="button" aria-label="Next" :class="navButtonClass" @click="navigate(1)">
                <ChevronRight class="size-4" />
            </button>
        </div>

        <div v-if="view === 'days'" class="grid grid-cols-7 gap-1">
            <span
                v-for="(weekday, index) in weekdays"
                :key="index"
                class="flex size-8 items-center justify-center text-[10px] uppercase tracking-wider text-text-faint"
            >
                {{ weekday }}
            </span>

            <button
                v-for="day in days"
                :key="day.toDateString()"
                type="button"
                :class="[
                    cellBaseClass,
                    'size-8',
                    cellClass(isSameDay(model, day), isSameDay(today, day), day.getMonth() !== viewDate.getMonth()),
                ]"
                :aria-pressed="isSameDay(model, day)"
                @click="selectDay(day)"
            >
                {{ day.getDate() }}
            </button>
        </div>

        <div v-else-if="view === 'months'" class="grid size-62 grid-cols-3 grid-rows-4 gap-1">
            <button
                v-for="(month, index) in months"
                :key="month"
                type="button"
                :class="[
                    cellBaseClass,
                    'capitalize',
                    cellClass(
                        model?.getFullYear() === viewYear && model?.getMonth() === index,
                        today.getFullYear() === viewYear && today.getMonth() === index,
                    ),
                ]"
                @click="selectMonth(index)"
            >
                {{ month }}
            </button>
        </div>

        <div v-else class="grid size-62 grid-cols-3 grid-rows-4 gap-1">
            <button
                v-for="year in years"
                :key="year"
                type="button"
                :class="[
                    cellBaseClass,
                    cellClass(model?.getFullYear() === year, today.getFullYear() === year),
                ]"
                @click="selectYear(year)"
            >
                {{ year }}
            </button>
        </div>
    </div>
</template>
