<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "../utils/cn";

const props = withDefaults(
    defineProps<{
        circle?: boolean;
        class?: HTMLAttributes["class"];
    }>(),
    {
        circle: false,
    },
);
</script>

<template>
    <div :class="cn('animate-pulse bg-bg-muted', circle ? 'rounded-full' : 'rounded-md', props.class)" />
</template>
