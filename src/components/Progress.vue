<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../utils/cn";

const props = withDefaults(
    defineProps<{
        value?: number;
        max?: number;
        label?: string;
        showValue?: boolean;
        color?: string;
        class?: HTMLAttributes["class"];
    }>(),
    {
        value: 0,
        max: 100,
        showValue: false,
    },
);

const percent = computed(() =>
    Math.min(100, Math.max(0, (props.value / props.max) * 100)),
);
</script>

<template>
    <div :class="cn('flex w-full flex-col gap-y-1.5', props.class)">
        <div v-if="label || showValue" class="flex items-center justify-between gap-x-2 text-xs">
            <span class="font-medium text-text-muted">{{ label }}</span>
            <span v-if="showValue" class="text-text-faint">{{ Math.round(percent) }}%</span>
        </div>

        <div
            role="progressbar"
            :aria-valuenow="value"
            aria-valuemin="0"
            :aria-valuemax="max"
            :aria-label="label"
            class="h-1.5 w-full overflow-hidden rounded-full bg-bg-muted"
        >
            <div
                class="h-full rounded-full transition-[width] duration-300"
                :style="{ width: `${percent}%`, background: color || 'var(--color-inverse)' }"
            />
        </div>
    </div>
</template>
