<script setup lang="ts">
	import type { HTMLAttributes } from "vue";
	import { cn } from "../utils/cn";

	const props = withDefaults(
		defineProps<{
			orientation?: "horizontal" | "vertical";
			decorative?: boolean;
			class?: HTMLAttributes["class"];
		}>(),
		{
			orientation: "horizontal",
			decorative: true,
		},
	);
</script>

<template>
	<div
		:role="decorative ? undefined : 'separator'"
		:aria-orientation="decorative ? undefined : orientation"
		:class="
			cn(
				'shrink-0 bg-border',
				orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
				props.class,
			)
		"
	/>
</template>
