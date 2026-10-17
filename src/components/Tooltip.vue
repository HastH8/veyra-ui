<script setup lang="ts">
import { onBeforeUnmount, ref, type HTMLAttributes } from "vue";
import { cn } from "../utils/cn";

const props = withDefaults(
    defineProps<{
        content?: string;
        side?: "top" | "bottom" | "left" | "right";
        delay?: number;
        class?: HTMLAttributes["class"];
    }>(),
    {
        side: "top",
        delay: 150,
    },
);

const triggerRef = ref<HTMLElement | null>(null);
const open = ref(false);

const tooltipStyle = ref<Record<string, string>>({});

let timer: ReturnType<typeof setTimeout> | undefined;

function updatePosition() {
    const trigger = triggerRef.value;

    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const gap = 6;
    const centerX = `${rect.left + rect.width / 2}px`;
    const centerY = `${rect.top + rect.height / 2}px`;

    const positions = {
        top: { left: centerX, top: `${rect.top - gap}px`, transform: "translate(-50%, -100%)" },
        bottom: { left: centerX, top: `${rect.bottom + gap}px`, transform: "translateX(-50%)" },
        left: { left: `${rect.left - gap}px`, top: centerY, transform: "translate(-100%, -50%)" },
        right: { left: `${rect.right + gap}px`, top: centerY, transform: "translateY(-50%)" },
    };

    tooltipStyle.value = positions[props.side];
}

function show() {
    clearTimeout(timer);
    timer = setTimeout(() => {
        updatePosition();
        open.value = true;
    }, props.delay);
}

function hide() {
    clearTimeout(timer);
    open.value = false;
}

onBeforeUnmount(() => clearTimeout(timer));
</script>

<template>
    <span
        ref="triggerRef"
        class="inline-flex"
        @mouseenter="show"
        @mouseleave="hide"
        @focusin="show"
        @focusout="hide"
    >
        <slot />

        <Teleport to="body">
            <div
                v-if="open"
                role="tooltip"
                :class="cn('pointer-events-none fixed z-[9999] whitespace-nowrap rounded-md border border-border bg-bg-base px-2 py-1 text-xs text-text-primary shadow-2xl', props.class)"
                :style="tooltipStyle"
            >
                <slot name="content">{{ content }}</slot>
            </div>
        </Teleport>
    </span>
</template>
