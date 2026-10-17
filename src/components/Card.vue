<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "../utils/cn";

const props = withDefaults(
    defineProps<{
        variant?: "default" | "horizontal" | "overlay";
        size?: "sm" | "md" | "lg";
        title?: string;
        description?: string;
        image?: string;
        imageAlt?: string;
        imageFlush?: boolean;
        value?: string;
        valueLabel?: string;
        class?: HTMLAttributes["class"];
    }>(),
    {
        variant: "default",
        size: "md",
        imageAlt: "",
        imageFlush: false,
    },
);

const sizes = {
    sm: {
        padding: "p-3",
        content: "px-3 pb-3",
        contentTop: "pt-1.5",
        flushTop: "pt-3",
        imageInset: "p-1.5",
        media: "w-32 h-20",
        title: "text-xs",
        description: "text-[11px]",
        body: "text-xs",
        meta: "text-[11px]",
        value: "text-sm",
    },
    md: {
        padding: "p-4",
        content: "px-4 pb-4",
        contentTop: "pt-2",
        flushTop: "pt-4",
        imageInset: "p-2",
        media: "w-44 h-28",
        title: "text-sm",
        description: "text-xs",
        body: "text-sm",
        meta: "text-xs",
        value: "text-base",
    },
    lg: {
        padding: "p-6",
        content: "px-6 pb-6",
        contentTop: "pt-3",
        flushTop: "pt-6",
        imageInset: "p-3",
        media: "w-56 h-36",
        title: "text-base",
        description: "text-sm",
        body: "text-base",
        meta: "text-sm",
        value: "text-lg",
    },
};
</script>

<template>
    <div
        v-if="variant === 'overlay'"
        :class="cn('relative w-full aspect-video rounded-lg border border-border bg-bg-surface min-w-0 overflow-hidden', props.class)"
    >
        <img
            v-if="image"
            :src="image"
            :alt="imageAlt"
            draggable="false"
            class="absolute inset-0 size-full object-cover"
        />

        <template v-if="title || description || $slots.default || $slots.footer">
            <div class="absolute inset-x-0 bottom-0 h-1/2 backdrop-blur-md [mask-image:linear-gradient(to_top,black_50%,transparent)]" />

            <div
                class="absolute inset-0 flex flex-col justify-end gap-y-1 bg-linear-to-t from-bg-base via-bg-base/60 to-transparent"
                :class="sizes[size].padding"
            >
                <p v-if="title" class="font-semibold text-text-primary" :class="sizes[size].title">{{ title }}</p>
                <p v-if="description" class="text-text-muted" :class="sizes[size].description">{{ description }}</p>

                <div v-if="$slots.default" class="mt-1 text-text-muted" :class="sizes[size].body">
                    <slot />
                </div>

                <div v-if="$slots.footer" class="flex items-center justify-end gap-x-2 mt-2">
                    <slot name="footer" />
                </div>
            </div>
        </template>
    </div>

    <div
        v-else-if="variant === 'horizontal'"
        :class="cn('w-full flex gap-x-3 rounded-lg border border-border bg-bg-surface min-w-0', sizes[size].padding, props.class)"
    >
        <div
            v-if="image"
            class="shrink-0 flex items-center justify-center overflow-hidden p-1"
            :class="sizes[size].media"
        >
            <img
                :src="image"
                :alt="imageAlt"
                draggable="false"
                class="size-full object-contain rounded-md"
            />
        </div>

        <div class="flex flex-col flex-1 min-w-0 gap-y-2">
            <div
                v-if="title || description || value || $slots.badges"
                class="flex items-start justify-between gap-x-3"
            >
                <div class="flex flex-col gap-y-1 min-w-0">
                    <div v-if="title || $slots.badges" class="flex items-center gap-x-2 flex-wrap">
                        <p v-if="title" class="font-semibold text-text-primary" :class="sizes[size].title">{{ title }}</p>
                        <slot name="badges" />
                    </div>
                    <p v-if="description" class="text-text-faint" :class="sizes[size].description">{{ description }}</p>
                </div>

                <div v-if="value" class="shrink-0 text-right">
                    <p class="font-bold text-text-primary" :class="sizes[size].value">{{ value }}</p>
                    <p v-if="valueLabel" class="text-[10px] text-text-faint">{{ valueLabel }}</p>
                </div>
            </div>

            <div v-if="$slots.meta" class="flex items-center gap-x-4 text-text-muted" :class="sizes[size].meta">
                <slot name="meta" />
            </div>

            <div
                v-if="$slots.default || $slots.footer"
                class="flex items-center justify-between gap-x-3 mt-auto"
            >
                <div class="flex items-center gap-x-1.5 flex-wrap">
                    <slot />
                </div>

                <div v-if="$slots.footer" class="flex items-center gap-x-2 shrink-0 ml-auto">
                    <slot name="footer" />
                </div>
            </div>
        </div>
    </div>

    <div
        v-else
        :class="cn('group w-full flex flex-col rounded-lg border border-border bg-bg-surface min-w-0 overflow-hidden', props.class)"
    >
        <div v-if="image" class="shrink-0" :class="{ [sizes[size].imageInset]: !imageFlush }">
            <div
                class="overflow-hidden"
                :class="imageFlush ? 'border-b border-border' : 'rounded-md border border-border'"
            >
                <img
                    :src="image"
                    :alt="imageAlt"
                    draggable="false"
                    class="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
        </div>

        <div
            v-if="title || description || $slots.default || $slots.footer"
            class="flex flex-1 flex-col"
            :class="image
                ? ['gap-y-3', sizes[size].content, imageFlush ? sizes[size].flushTop : sizes[size].contentTop]
                : 'divide-y divide-border'"
        >
            <div
                v-if="title || description"
                class="flex flex-col gap-y-1"
                :class="{ [sizes[size].padding]: !image }"
            >
                <p v-if="title" class="font-semibold text-text-primary" :class="sizes[size].title">{{ title }}</p>
                <p v-if="description" class="text-text-faint" :class="sizes[size].description">{{ description }}</p>
            </div>

            <div
                v-if="$slots.default"
                class="flex-1 text-text-muted"
                :class="[sizes[size].body, { [sizes[size].padding]: !image }]"
            >
                <slot />
            </div>

            <div
                v-if="$slots.footer"
                class="flex items-center gap-x-2"
                :class="image ? 'justify-start' : ['justify-end', sizes[size].padding]"
            >
                <slot name="footer" />
            </div>
        </div>
    </div>
</template>
