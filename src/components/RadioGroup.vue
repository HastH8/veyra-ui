<script setup lang="ts">
import { useId, type HTMLAttributes } from "vue";
import { cn } from "../utils/cn";

interface RadioOption {
    label: string;
    value: string;
    disabled?: boolean;
}

const props = withDefaults(
    defineProps<{
        options: RadioOption[];
        label?: string;
        name?: string;
        orientation?: "vertical" | "horizontal";
        disabled?: boolean;
        class?: HTMLAttributes["class"];
    }>(),
    {
        orientation: "vertical",
        disabled: false,
    },
);

const model = defineModel<string>();

const id = useId();
</script>

<template>
    <div role="radiogroup" :class="cn('flex flex-col gap-y-1.5', props.class)" :aria-label="label">
        <p v-if="label" class="text-sm font-medium text-text-muted">{{ label }}</p>

        <div
            class="flex"
            :class="orientation === 'vertical' ? 'flex-col gap-y-2' : 'flex-wrap gap-x-4 gap-y-2'"
        >
            <label
                v-for="option in options"
                :key="option.value"
                class="group inline-flex items-center gap-x-2 text-sm text-text-primary select-none"
                :class="disabled || option.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'"
            >
                <input
                    v-model="model"
                    type="radio"
                    :name="name ?? id"
                    :value="option.value"
                    :disabled="disabled || option.disabled"
                    class="peer sr-only"
                />

                <span
                    class="flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring"
                    :class="model === option.value
                        ? 'border-inverse'
                        : 'border-border bg-bg-surface group-hover:bg-bg-muted'"
                >
                    <span v-if="model === option.value" class="size-2 rounded-full bg-inverse" />
                </span>

                {{ option.label }}
            </label>
        </div>
    </div>
</template>
