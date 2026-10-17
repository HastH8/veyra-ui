<script setup lang="ts">
import { onBeforeUnmount, onMounted, type Component, type HTMLAttributes } from "vue";
import { X } from "@lucide/vue";
import { cn } from "../utils/cn";

const props = withDefaults(
    defineProps<{
        title?: string;
        icon?: Component;
        width?: string;
        closeOnBackdrop?: boolean;
        class?: HTMLAttributes["class"];
    }>(),
    {
        width: "24rem",
        closeOnBackdrop: true,
    },
);

const emit = defineEmits<{
    close: [];
}>();

function handleBackdropClick() {
    if (props.closeOnBackdrop) emit("close");
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") emit("close");
}

onMounted(() => document.addEventListener("keydown", handleKeydown));
onBeforeUnmount(() => document.removeEventListener("keydown", handleKeydown));
</script>

<template>
    <Teleport to="body">
        <div
            class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            @click.self="handleBackdropClick"
        >
            <div
                role="dialog"
                aria-modal="true"
                :aria-label="title"
                :class="cn('flex w-full flex-col rounded-lg border border-border bg-bg-base shadow-2xl', props.class)"
                :style="{ maxWidth: width }"
            >
                <div
                    v-if="title || icon"
                    class="flex items-center gap-x-2 px-5 py-4 border-b border-border"
                >
                    <component :is="icon" v-if="icon" class="size-4 shrink-0 text-text-faint" />
                    <p class="text-sm font-semibold text-text-primary truncate">{{ title }}</p>

                    <button
                        type="button"
                        aria-label="Close"
                        class="ml-auto flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-text-faint transition-colors hover:bg-bg-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        @click="emit('close')"
                    >
                        <X class="size-4" />
                    </button>
                </div>

                <slot />

                <div
                    v-if="$slots.footer"
                    class="flex items-center justify-end gap-x-2 px-5 py-3 border-t border-border"
                >
                    <slot name="footer" />
                </div>
            </div>
        </div>
    </Teleport>
</template>
