<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "../utils/cn";

const props = defineProps<{
    class?: HTMLAttributes["class"];
}>();
</script>

<template>
    <kbd :class="cn('inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-bg-muted px-1.5 font-mono text-[10px] font-medium text-text-muted', props.class)">
        <slot />
    </kbd>
</template>
