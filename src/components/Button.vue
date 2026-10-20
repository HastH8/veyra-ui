<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "../utils/cn";

const props = withDefaults(
    defineProps<{
        variant?: "primary" | "secondary" | "solid" | "outline" | "danger" | "success" | "warning";
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

const variants = {
    primary: "border border-border bg-bg-muted text-text-primary hover:bg-bg-muted-hover active:bg-bg-muted-active",
    secondary: "text-text-primary hover:bg-bg-muted active:bg-bg-muted-hover",
    solid: "border border-inverse bg-inverse text-text-inverse hover:bg-inverse/90 active:bg-inverse/80",
    outline: "border border-border text-text-primary hover:bg-bg-surface active:bg-bg-muted",
    danger: "border border-danger/25 bg-danger/10 text-danger hover:bg-danger/15 active:bg-danger/20",
    success: "border border-success/25 bg-success/10 text-success hover:bg-success/15 active:bg-success/20",
    warning: "border border-warning/25 bg-warning/10 text-warning hover:bg-warning/15 active:bg-warning/20",
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
            variants[variant],
            props.class,
        )"
    >
        <slot />
    </button>
</template>
