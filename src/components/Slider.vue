<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../utils/cn";

const props = withDefaults(
    defineProps<{
        min?: number;
        max?: number;
        step?: number;
        label?: string;
        showValue?: boolean;
        name?: string;
        disabled?: boolean;
        class?: HTMLAttributes["class"];
    }>(),
    {
        min: 0,
        max: 100,
        step: 1,
        showValue: false,
        disabled: false,
    },
);

const model = defineModel<number>({ default: 0 });

const percent = computed(() =>
    ((model.value - props.min) / (props.max - props.min)) * 100,
);
</script>

<template>
    <div :class="cn('flex w-full flex-col gap-y-2', props.class)">
        <div v-if="label || showValue" class="flex items-center justify-between gap-x-2 text-xs">
            <span class="font-medium text-text-muted">{{ label }}</span>
            <span v-if="showValue" class="text-text-faint">{{ model }}</span>
        </div>

        <input
            v-model.number="model"
            type="range"
            :min="min"
            :max="max"
            :step="step"
            :name="name"
            :disabled="disabled"
            :aria-label="label"
            :class="[
                'h-1.5 w-full cursor-pointer appearance-none rounded-full',
                'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
                'disabled:pointer-events-none disabled:opacity-50',
                '[&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-bg-base [&::-webkit-slider-thumb]:bg-inverse',
                '[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-bg-base [&::-moz-range-thumb]:bg-inverse [&::-moz-range-track]:bg-transparent',
            ]"
            :style="{ background: `linear-gradient(to right, var(--color-inverse) ${percent}%, var(--color-bg-muted) ${percent}%)` }"
        />
    </div>
</template>
