<script setup lang="ts">
import {
    computed,
    nextTick,
    onBeforeUnmount,
    ref,
    watch,
    type HTMLAttributes,
} from "vue";
import { CalendarDays } from "@lucide/vue";
import Calendar from "./Calendar.vue";
import Inputs from "./Inputs.vue";
import { cn } from "../utils/cn";

const props = withDefaults(
    defineProps<{
        size?: "sm" | "md" | "lg";
        placeholder?: string;
        name?: string;
        disabled?: boolean;
        showPicker?: boolean;
        locale?: string;
        weekStartsOn?: 0 | 1;
        class?: HTMLAttributes["class"];
    }>(),
    {
        size: "md",
        disabled: false,
        showPicker: true,
        locale: "en-US",
        weekStartsOn: 1,
    },
);

const model = defineModel<Date | null>({ default: null });

const rootRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const open = ref(false);

const menuStyle = ref<Record<string, string>>({});

const sizes = {
    sm: { input: "pr-8", button: "w-8", icon: "size-3.5" },
    md: { input: "pr-9", button: "w-9", icon: "size-4" },
    lg: { input: "pr-11", button: "w-11", icon: "size-5" },
};

function formatDate(date: Date | null) {
    if (!date) return "";

    const pad = (value: number) => String(value).padStart(2, "0");

    return `${pad(date.getDate())} / ${pad(date.getMonth() + 1)} / ${date.getFullYear()}`;
}

// "17 / 10 / 2026" -> Date, or null when incomplete or not a real date
function parseDate(value: string) {
    const digits = value.replace(/\D/g, "");

    if (digits.length !== 8) return null;

    const day = Number(digits.slice(0, 2));
    const month = Number(digits.slice(2, 4)) - 1;
    const year = Number(digits.slice(4));
    const date = new Date(year, month, day);

    return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day
        ? date
        : null;
}

function isSameDate(a: Date | null, b: Date | null) {
    return a?.toDateString() === b?.toDateString();
}

const text = ref(formatDate(model.value));

const invalid = computed(
    () => text.value.replace(/\D/g, "").length === 8 && !parseDate(text.value),
);

watch(text, (value) => {
    const date = parseDate(value);

    if (date && !isSameDate(date, model.value)) model.value = date;
    else if (!value) model.value = null;
});

watch(model, (value) => {
    if (!isSameDate(parseDate(text.value), value)) text.value = formatDate(value);
});

function updateMenuPosition() {
    const root = rootRef.value;
    const menu = menuRef.value;

    if (!root || !menu) return;

    const rect = root.getBoundingClientRect();
    const gap = 4;
    const viewportPadding = 8;
    const placeAbove =
        window.innerHeight - rect.bottom < menu.offsetHeight + gap + viewportPadding &&
        rect.top > menu.offsetHeight + gap + viewportPadding;

    menuStyle.value = {
        left: `${Math.max(viewportPadding, Math.min(rect.left, window.innerWidth - menu.offsetWidth - viewportPadding))}px`,
        top: placeAbove
            ? `${rect.top - menu.offsetHeight - gap}px`
            : `${rect.bottom + gap}px`,
    };
}

async function toggleOpen() {
    if (props.disabled) return;

    open.value = !open.value;

    if (open.value) {
        await nextTick();
        updateMenuPosition();
    }
}

function selectDate(date: Date | null) {
    model.value = date;
    open.value = false;
}

function handleOutsideClick(event: PointerEvent) {
    const target = event.target;

    if (!(target instanceof Node)) return;

    if (
        !rootRef.value?.contains(target) &&
        !menuRef.value?.contains(target)
    ) {
        open.value = false;
    }
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") open.value = false;
}

function handlePositionChange() {
    if (open.value) updateMenuPosition();
}

watch(open, (isOpen) => {
    if (isOpen) {
        document.addEventListener("pointerdown", handleOutsideClick);
        document.addEventListener("keydown", handleKeydown);
        window.addEventListener("resize", handlePositionChange);
        window.addEventListener("scroll", handlePositionChange, true);
    } else {
        document.removeEventListener("pointerdown", handleOutsideClick);
        document.removeEventListener("keydown", handleKeydown);
        window.removeEventListener("resize", handlePositionChange);
        window.removeEventListener("scroll", handlePositionChange, true);
    }
});

onBeforeUnmount(() => {
    document.removeEventListener("pointerdown", handleOutsideClick);
    document.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("resize", handlePositionChange);
    window.removeEventListener("scroll", handlePositionChange, true);
});
</script>

<template>
    <div ref="rootRef" :class="cn('relative w-full', props.class)">
        <Inputs
            v-model="text"
            type="date"
            :size="size"
            :placeholder="placeholder"
            :name="name"
            :disabled="disabled"
            :class="[{ [sizes[size].input]: showPicker, 'border-red-500/50': invalid }]"
        />

        <button
            v-if="showPicker"
            type="button"
            aria-label="Open calendar"
            :aria-expanded="open"
            :disabled="disabled"
            class="absolute inset-y-0 right-0 flex cursor-pointer items-center justify-center text-text-faint transition-colors hover:text-text-primary disabled:pointer-events-none disabled:opacity-50"
            :class="[sizes[size].button, { 'text-text-primary': open }]"
            @click="toggleOpen"
        >
            <CalendarDays :class="sizes[size].icon" />
        </button>

        <Teleport to="body">
            <div
                v-if="open"
                ref="menuRef"
                class="fixed z-[9999] rounded-lg bg-bg-base shadow-2xl"
                :style="menuStyle"
            >
                <Calendar
                    :model-value="model"
                    :locale="locale"
                    :week-starts-on="weekStartsOn"
                    @update:model-value="selectDate"
                />
            </div>
        </Teleport>
    </div>
</template>
