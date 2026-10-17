<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { Check } from "@lucide/vue";
import { cn } from "../utils/cn";

const props = withDefaults(
    defineProps<{
        label?: string;
        name?: string;
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
            'group inline-flex items-center gap-x-2 text-sm text-text-primary select-none',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            props.class,
        )"
    >
        <input
            v-model="model"
            type="checkbox"
            :name="name"
            :disabled="disabled"
            class="peer sr-only"
        />

        <span
            class="flex size-4 shrink-0 items-center justify-center rounded border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring"
            :class="model
                ? 'border-inverse bg-inverse text-text-inverse'
                : 'border-border bg-bg-surface group-hover:bg-bg-muted'"
        >
            <Check v-if="model" class="size-3" :stroke-width="3" />
        </span>

        <span v-if="label">{{ label }}</span>
    </label>
</template>
