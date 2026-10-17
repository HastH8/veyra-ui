<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { Moon, Sun } from "@lucide/vue";
import { useTheme } from "../composables/useTheme";
import { cn } from "../utils/cn";

const props = defineProps<{
    class?: HTMLAttributes["class"];
}>();

const { theme, toggleTheme } = useTheme();
</script>

<template>
    <button
        type="button"
        :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
        :class="cn(
            'inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-border',
            'bg-bg-muted text-text-primary transition-colors hover:bg-bg-muted-hover active:bg-bg-muted-active',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            props.class,
        )"
        @click="toggleTheme"
    >
        <Sun v-if="theme === 'dark'" class="size-4" />
        <Moon v-else class="size-4" />
    </button>
</template>
