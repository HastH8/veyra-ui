<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "../utils/cn";

const props = withDefaults(
    defineProps<{
        variant?: "primary" | "secondary";
        size?: "sm" | "md" | "lg";
        disabled?: boolean;
        class?: HTMLAttributes["class"];
    }>(),
    {
        variant: "primary",
        size: "md",
        disabled: false,
    },
);

const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-5 py-2.5 text-base rounded-lg",
};
</script>

<template>
    <button
        :disabled="disabled"
        :class="cn(
            'inline-flex items-center justify-center gap-x-2',
            'font-semibold transition-colors',
            sizes[size],
            'focus-visible:outline-2 focus-visible:outline-offset-2',
            'disabled:pointer-events-none disabled:opacity-50',
            variant === 'primary'
                ? 'bg-bg-muted text-text-primary hover:bg-bg-muted-hover active:bg-bg-muted-active border border-border'
                : 'text-text-primary hover:bg-bg-muted active:bg-bg-muted-hover',
            props.class,
        )"
    >
        <slot />
    </button>
</template>
