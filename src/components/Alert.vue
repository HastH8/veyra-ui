<script setup lang="ts">
import { computed, type Component, type HTMLAttributes } from "vue";
import { CircleAlert, CircleCheck, Info, X } from "@lucide/vue";
import { cn } from "../utils/cn";

const props = withDefaults(
    defineProps<{
        variant?: "default" | "success" | "danger";
        title?: string;
        description?: string;
        icon?: Component | null;
        color?: string;
        colored?: boolean;
        dismissible?: boolean;
        class?: HTMLAttributes["class"];
    }>(),
    {
        variant: "default",
        icon: undefined,
        colored: true,
        dismissible: false,
    },
);

const emit = defineEmits<{
    close: [];
}>();

const variants = {
    default: { color: undefined, icon: Info },
    success: { color: "#22c55e", icon: CircleCheck },
    danger: { color: "#f43f5e", icon: CircleAlert },
};

const activeColor = computed(() =>
    props.colored ? props.color ?? variants[props.variant].color : undefined,
);
</script>

<template>
    <div
        role="alert"
        :class="cn('flex w-full items-start gap-x-2.5 rounded-md border border-border bg-bg-surface px-3 py-2.5', props.class)"
        :style="activeColor
            ? {
                background: `color-mix(in srgb, ${activeColor} 8%, transparent)`,
                borderColor: `color-mix(in srgb, ${activeColor} 25%, transparent)`,
            }
            : undefined"
    >
        <component
            :is="icon ?? variants[variant].icon"
            v-if="icon !== null"
            class="mt-px size-3.5 shrink-0 text-text-muted"
            :style="activeColor ? { color: activeColor } : undefined"
        />

        <div class="flex flex-1 flex-col gap-y-0.5 min-w-0">
            <p v-if="title" class="text-xs font-semibold text-text-primary">{{ title }}</p>
            <div v-if="description || $slots.default" class="text-xs text-text-muted">
                <slot>{{ description }}</slot>
            </div>
        </div>

        <button
            v-if="dismissible"
            type="button"
            aria-label="Close"
            class="flex size-4 shrink-0 cursor-pointer items-center justify-center rounded text-text-faint transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            @click="emit('close')"
        >
            <X class="size-3.5" />
        </button>
    </div>
</template>
