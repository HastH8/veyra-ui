<script setup lang="ts">
	import type { Component, HTMLAttributes } from "vue";
	import { Inbox } from "@lucide/vue";
	import { cn } from "../utils/cn";

	const props = withDefaults(
		defineProps<{
			title: string;
			description?: string;
			icon?: Component | null;
			class?: HTMLAttributes["class"];
		}>(),
		{
			icon: undefined,
		},
	);
</script>

<template>
	<section
		:class="
			cn(
				'flex w-full flex-col items-center justify-center gap-y-3 rounded-lg border border-dashed border-border px-6 py-10 text-center',
				props.class,
			)
		"
	>
		<component
			:is="icon ?? Inbox"
			v-if="icon !== null"
			aria-hidden="true"
			class="size-8 text-text-faint"
		/>
		<div class="flex max-w-sm flex-col gap-y-1">
			<h3 class="text-sm font-semibold text-text-primary">{{ title }}</h3>
			<p
				v-if="description || $slots.description"
				class="text-sm text-text-muted"
			>
				<slot name="description">{{ description }}</slot>
			</p>
		</div>
		<div v-if="$slots.default" class="flex items-center gap-2">
			<slot />
		</div>
	</section>
</template>
