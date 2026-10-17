<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "../utils/cn";

const props = withDefaults(
    defineProps<{
        disabled?: boolean;
        class?: HTMLAttributes["class"];
    }>(),
    {
        disabled: false,
    },
);

const pressed = defineModel<boolean>({ default: false });
</script>

<template>
    <button
        type="button"
        :aria-pressed="pressed"
        :disabled="disabled"
        :class="cn(
            'inline-flex items-center justify-center gap-x-2 rounded-lg px-3 py-2',
            'text-sm font-semibold transition-colors border',
            'focus-visible:outline-2 focus-visible:outline-offset-2',
            'disabled:pointer-events-none disabled:opacity-50',
            pressed
                ? 'bg-bg-muted-hover text-text-primary border-border'
                : 'border-transparent text-text-faint hover:bg-bg-muted hover:text-text-primary',
            props.class,
        )"
        @click="pressed = !pressed"
    >
        <slot />
    </button>
</template>
