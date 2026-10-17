<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../utils/cn";

const props = withDefaults(
    defineProps<{
    type?: "text" | "password" | "email" | "number" | "date";
    size?: "sm" | "md" | "lg";
    min?: number;
    max?: number;
    disabled?: boolean;
    placeholder?: string;
    name?: string;
    required?: boolean;
    class?: HTMLAttributes["class"];
    }>(),
    {
        type: "text",
        size: "md",
        disabled: false,
        required: false,
    },
);

const model = defineModel<string | number>();

const sizes = {
    sm: "px-2.5 py-1.5 text-xs rounded-md",
    md: "px-3 py-2 text-sm rounded-lg",
    lg: "px-4 py-2.5 text-base rounded-lg",
};

const inputClass = computed(() =>
    cn(
        "w-full border border-border bg-bg-surface text-text-primary placeholder:text-text-faint",
        sizes[props.size],
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        props.class,
    ),
);

// "17102026" -> "17 / 10 / 2026"
function formatDate(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8);

    return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)]
        .filter(Boolean)
        .join(" / ");
}

function handleDateInput(event: Event) {
    const input = event.target as HTMLInputElement;

    input.value = formatDate(input.value);
    model.value = input.value;
}
</script>

<template>
    <input
        v-if="type === 'date'"
        :value="model"
        type="text"
        inputmode="numeric"
        maxlength="14"
        :disabled="disabled"
        :placeholder="placeholder ?? 'DD / MM / YYYY'"
        :name="name"
        :required="required"
        :class="inputClass"
        @input="handleDateInput"
    />

    <input
        v-else
        v-model="model"
        :type="type"
        :min="type === 'number' ? min : undefined"
        :max="type === 'number' ? max : undefined"
        :disabled="disabled"
        :placeholder="placeholder"
        :name="name"
        :required="required"
        :class="inputClass"
    />
</template>
