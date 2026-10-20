<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "../utils/cn";

const props = withDefaults(
    defineProps<{
        label?: string;
        disabled?: boolean;
        class?: HTMLAttributes["class"];
    }>(),
    {
        disabled: false,
    },
);

const model = defineModel<boolean>({ default: false });
</script>

<template>
    <label
        :class="cn(
            'inline-flex items-center gap-x-2 text-sm text-text-primary select-none',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            props.class,
        )"
    >
        <button
            type="button"
            role="switch"
            :aria-checked="model"
            :disabled="disabled"
            class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none"
            :class="model ? 'border-inverse bg-inverse' : 'border-border bg-bg-muted'"
            @click="model = !model"
        >
            <span
                class="absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full transition-[left]"
                :class="model ? 'bg-bg-base' : 'bg-text-faint'"
                :style="{ left: model ? 'calc(100% - 1rem)' : '0.125rem' }"
            />
        </button>

        <span v-if="label">{{ label }}</span>
    </label>
</template>
