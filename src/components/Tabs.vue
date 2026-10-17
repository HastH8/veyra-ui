<script setup lang="ts">
import type { Component, HTMLAttributes } from "vue";
import { cn } from "../utils/cn";

interface TabItem {
    label: string;
    value: string;
    icon?: Component;
    disabled?: boolean;
}

const props = withDefaults(
    defineProps<{
        tabs: TabItem[];
        variant?: "default" | "underline";
        class?: HTMLAttributes["class"];
    }>(),
    {
        variant: "default",
    },
);

const model = defineModel<string>();
</script>

<template>
    <div :class="cn('flex w-full flex-col gap-y-4', props.class)">
        <div
            role="tablist"
            :class="variant === 'default'
                ? 'inline-flex w-fit gap-x-1 rounded-lg border border-border bg-bg-surface p-1'
                : 'flex gap-x-4 border-b border-border'"
        >
            <button
                v-for="tab in tabs"
                :key="tab.value"
                type="button"
                role="tab"
                :aria-selected="model === tab.value"
                :disabled="tab.disabled"
                :class="[
                    'inline-flex cursor-pointer items-center gap-x-1.5 text-sm font-medium transition-colors',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    'disabled:pointer-events-none disabled:opacity-50',
                    variant === 'default'
                        ? ['rounded-md px-3 py-1.5', model === tab.value ? 'bg-bg-muted-hover text-text-primary' : 'text-text-faint hover:text-text-primary']
                        : ['-mb-px border-b-2 pb-2', model === tab.value ? 'border-inverse text-text-primary' : 'border-transparent text-text-faint hover:text-text-primary'],
                ]"
                @click="model = tab.value"
            >
                <component :is="tab.icon" v-if="tab.icon" class="size-4" />
                {{ tab.label }}
            </button>
        </div>

        <div v-if="model && $slots[model]" role="tabpanel">
            <slot :name="model" />
        </div>
    </div>
</template>
