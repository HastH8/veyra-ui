<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { ChevronLeft, ChevronRight } from "@lucide/vue";
import { cn } from "../utils/cn";

const props = withDefaults(
    defineProps<{
        total: number;
        siblings?: number;
        class?: HTMLAttributes["class"];
    }>(),
    {
        siblings: 1,
    },
);

const page = defineModel<number>({ default: 1 });

const pages = computed(() => {
    const start = Math.max(2, page.value - props.siblings);
    const end = Math.min(props.total - 1, page.value + props.siblings);
    const items: (number | "...")[] = [1];

    if (start > 2) items.push("...");
    for (let index = start; index <= end; index++) items.push(index);
    if (end < props.total - 1) items.push("...");
    if (props.total > 1) items.push(props.total);

    return items;
});

const buttonClass = "flex size-8 cursor-pointer items-center justify-center rounded-md text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50";
</script>

<template>
    <nav aria-label="Pagination" :class="cn('flex items-center gap-x-1', props.class)">
        <button
            type="button"
            aria-label="Previous page"
            :disabled="page <= 1"
            :class="[buttonClass, 'text-text-faint hover:bg-bg-muted hover:text-text-primary']"
            @click="page--"
        >
            <ChevronLeft class="size-4" />
        </button>

        <template v-for="(item, index) in pages" :key="index">
            <span
                v-if="item === '...'"
                class="flex size-8 items-center justify-center text-sm text-text-faint"
            >
                …
            </span>

            <button
                v-else
                type="button"
                :aria-current="item === page ? 'page' : undefined"
                :class="[
                    buttonClass,
                    item === page
                        ? 'bg-inverse text-text-inverse font-semibold'
                        : 'text-text-muted hover:bg-bg-muted hover:text-text-primary',
                ]"
                @click="page = item"
            >
                {{ item }}
            </button>
        </template>

        <button
            type="button"
            aria-label="Next page"
            :disabled="page >= total"
            :class="[buttonClass, 'text-text-faint hover:bg-bg-muted hover:text-text-primary']"
            @click="page++"
        >
            <ChevronRight class="size-4" />
        </button>
    </nav>
</template>
