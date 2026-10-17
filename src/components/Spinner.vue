<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "../utils/cn";

const props = withDefaults(
    defineProps<{
        variant?: "ring" | "lines" | "dual" | "arc" | "dashed";
        size?: "sm" | "md" | "lg";
        class?: HTMLAttributes["class"];
    }>(),
    {
        variant: "ring",
        size: "md",
    },
);

const sizes = {
    sm: "size-4",
    md: "size-6",
    lg: "size-8",
};
</script>

<template>
    <span
        role="status"
        aria-label="Loading"
        :class="cn('relative inline-flex shrink-0 items-center justify-center', sizes[size], props.class)"
    >
        <span
            v-if="variant === 'ring'"
            class="size-full animate-spin rounded-full border-2 border-border border-t-current"
        />

        <span v-else-if="variant === 'lines'" class="relative size-full">
            <span
                v-for="index in 8"
                :key="index"
                class="line absolute left-1/2 top-0 h-1/4 w-[10%] -translate-x-1/2 rounded-full bg-current"
                :style="{
                    transform: `rotate(${(index - 1) * 45}deg)`,
                    animationDelay: `${(index - 9) * 0.1}s`,
                }"
            />
        </span>

        <span
            v-else-if="variant === 'dual'"
            class="size-full animate-spin rounded-full border-2 border-transparent border-t-current border-b-current"
        />

        <svg v-else-if="variant === 'arc'" viewBox="0 0 24 24" fill="none" class="size-full animate-spin [animation-duration:2s]">
            <circle cx="12" cy="12" r="10" class="stroke-border" stroke-width="2" />
            <circle class="arc" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>

        <span
            v-else
            class="size-full animate-spin rounded-full border-2 border-dashed border-current"
        />
    </span>
</template>

<style scoped>
.line {
    transform-origin: 50% 200%;
    animation: line 0.8s linear infinite;
}

.arc {
    animation: arc 1.5s ease-in-out infinite;
}

@keyframes line {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0.15;
    }
}

@keyframes arc {
    0% {
        stroke-dasharray: 1 100;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 45 100;
        stroke-dashoffset: -17;
    }
    100% {
        stroke-dasharray: 45 100;
        stroke-dashoffset: -62;
    }
}
</style>
