<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "../utils/cn";

const props = withDefaults(
    defineProps<{
        variant?: "default" | "outline" | "success" | "muted" | "danger";
        color?: string;
        dot?: boolean;
        class?: HTMLAttributes["class"];
    }>(),
    {
        variant: "default",
        dot: false,
    },
);

const variants = {
    default: "border-border bg-bg-muted text-text-primary",
    outline: "border-border text-text-muted",
    success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    muted: "border-zinc-500/20 bg-zinc-500/10 text-zinc-400",
    danger: "border-red-500/20 bg-red-500/10 text-red-400",
};
</script>

<template>
    <span
        :class="cn(
            'inline-flex items-center gap-x-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap',
            color ? undefined : variants[variant],
            props.class,
        )"
        :style="color
            ? {
                color,
                background: `color-mix(in srgb, ${color} 10%, transparent)`,
                borderColor: `color-mix(in srgb, ${color} 20%, transparent)`,
            }
            : undefined"
    >
        <span v-if="dot" class="size-1.5 shrink-0 rounded-full bg-current" />
        <slot />
    </span>
</template>
