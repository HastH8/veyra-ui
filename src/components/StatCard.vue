<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "../utils/cn";

const props = withDefaults(
    defineProps<{
        icon?: string;
        label: string;
        value: string;
        color?: string;
        class?: HTMLAttributes["class"];
    }>(),
    {
        icon: undefined,
        label: '',
        value: '',
        color: undefined,
    },
);
</script>

<template>
    <div :class="cn('w-full flex flex-col gap-y-1.5 p-3 rounded-md border border-border bg-bg-surface min-w-0', props.class)">
        <div class="flex items-center justify-between gap-x-2">
            <p class="text-[10px] uppercase tracking-wider truncate text-text-faint">{{ label }}</p>
            <component v-if="icon" :is="icon" class="w-3.5 h-3.5 shrink-0 text-icon" />
        </div>
        <div ref="box" class="min-w-0 overflow-hidden">
            <p ref="text" class="font-bold leading-none whitespace-nowrap w-max"
                :style="{ color: color || 'var(--color-text-primary)', fontSize: `${24}px` }">{{ value }}</p>
        </div>
    </div>
</template>
