<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { ChevronDown } from "@lucide/vue";
import { cn } from "../utils/cn";

interface AccordionItem {
    title: string;
    value: string;
    content?: string;
}

const props = withDefaults(
    defineProps<{
        items: AccordionItem[];
        variant?: "default" | "underline";
        multiple?: boolean;
        class?: HTMLAttributes["class"];
    }>(),
    {
        variant: "default",
        multiple: false,
    },
);

const model = defineModel<string[]>({ default: () => [] });

function toggle(value: string) {
    if (model.value.includes(value)) {
        model.value = model.value.filter((item) => item !== value);
        return;
    }

    model.value = props.multiple ? [...model.value, value] : [value];
}
</script>

<template>
    <div
        :class="cn(
            'w-full',
            { 'rounded-lg border border-border bg-bg-surface divide-y divide-border': variant === 'default' },
            props.class,
        )"
    >
        <div
            v-for="item in items"
            :key="item.value"
            :class="{ 'border-b border-border': variant === 'underline' }"
        >
            <button
                type="button"
                :class="[
                    'flex w-full cursor-pointer items-center justify-between gap-x-2 py-3 text-left text-sm font-medium transition-colors',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                    variant === 'default'
                        ? 'px-4 text-text-primary hover:bg-bg-surface'
                        : model.includes(item.value) ? 'text-text-primary' : 'text-text-faint hover:text-text-primary',
                ]"
                :aria-expanded="model.includes(item.value)"
                @click="toggle(item.value)"
            >
                {{ item.title }}
                <ChevronDown
                    class="size-4 shrink-0 text-text-faint transition-transform"
                    :class="{ 'rotate-180': model.includes(item.value) }"
                />
            </button>

            <div
                class="grid transition-[grid-template-rows] duration-200"
                :class="model.includes(item.value) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
            >
                <div class="overflow-hidden">
                    <div class="pb-3 text-sm text-text-muted" :class="{ 'px-4': variant === 'default' }">
                        <slot :name="item.value">{{ item.content }}</slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
