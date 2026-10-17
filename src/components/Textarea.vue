<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../utils/cn";

const props = withDefaults(
    defineProps<{
    size?: "sm" | "md" | "lg";
    rows?: number;
    maxRows?: number;
    resizable?: boolean;
    maxlength?: number;
    disabled?: boolean;
    placeholder?: string;
    name?: string;
    required?: boolean;
    class?: HTMLAttributes["class"];
    }>(),
    {
        size: "md",
        rows: 3,
        maxRows: 8,
        resizable: true,
        disabled: false,
        required: false,
    },
);

const model = defineModel<string>({ default: "" });

// lineHeight and padding must match the field classes for the maxRows calculation
const sizes = {
    sm: {
        field: "px-2.5 py-1.5 text-xs rounded-md",
        counterPadding: "pb-5",
        counter: "bottom-1.5 right-2.5 text-[10px]",
        lineHeight: "1rem",
        padding: "0.75rem",
        counterSpace: "1.625rem",
    },
    md: {
        field: "px-3 py-2 text-sm rounded-lg",
        counterPadding: "pb-6",
        counter: "bottom-2 right-3 text-[10px]",
        lineHeight: "1.25rem",
        padding: "1rem",
        counterSpace: "2rem",
    },
    lg: {
        field: "px-4 py-2.5 text-base rounded-lg",
        counterPadding: "pb-7",
        counter: "bottom-2.5 right-4 text-xs",
        lineHeight: "1.5rem",
        padding: "1.25rem",
        counterSpace: "2.375rem",
    },
};

// rows * line-height + vertical padding + border
const maxHeight = computed(() => {
    const size = sizes[props.size];

    return Number.isFinite(props.maxRows)
        ? `calc(${props.maxRows} * ${size.lineHeight} + ${props.maxlength ? size.counterSpace : size.padding} + 2px)`
        : undefined;
});
</script>

<template>
    <div :class="cn('relative w-full', props.class)">
        <textarea
            v-model="model"
            :rows="rows"
            :maxlength="maxlength"
            :disabled="disabled"
            :placeholder="placeholder"
            :name="name"
            :required="required"
            :style="{ maxHeight }"
            :class="[
                'block w-full border border-border bg-bg-surface text-text-primary placeholder:text-text-faint',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                'disabled:pointer-events-none disabled:opacity-50',
                sizes[size].field,
                resizable ? 'resize-y' : 'resize-none',
                { [sizes[size].counterPadding]: maxlength },
            ]"
        />

        <span
            v-if="maxlength"
            class="pointer-events-none absolute text-text-faint"
            :class="sizes[size].counter"
        >
            {{ model.length }}/{{ maxlength }}
        </span>
    </div>
</template>
