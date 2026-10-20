<script setup lang="ts">
	import {
		computed,
		onBeforeUnmount,
		onMounted,
		ref,
		type HTMLAttributes,
	} from "vue";
	import { cn } from "../utils/cn";

	const props = withDefaults(
		defineProps<{
			side?: "top" | "bottom";
			align?: "start" | "center" | "end";
			closeOnOutside?: boolean;
			class?: HTMLAttributes["class"];
		}>(),
		{ side: "bottom", align: "start", closeOnOutside: true },
	);

	const open = defineModel<boolean>("open", { default: false });
	const root = ref<HTMLElement | null>(null);
	const panelClass = computed(() => ({
		"top-full mt-2": props.side === "bottom",
		"bottom-full mb-2": props.side === "top",
		"left-0": props.align === "start",
		"left-1/2 -translate-x-1/2": props.align === "center",
		"right-0": props.align === "end",
	}));

	function toggle() {
		open.value = !open.value;
	}

	function close() {
		open.value = false;
	}

	function handleOutside(event: PointerEvent) {
		if (props.closeOnOutside && !root.value?.contains(event.target as Node))
			close();
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === "Escape") close();
	}

	onMounted(() => {
		document.addEventListener("pointerdown", handleOutside);
		document.addEventListener("keydown", handleKeydown);
	});
	onBeforeUnmount(() => {
		document.removeEventListener("pointerdown", handleOutside);
		document.removeEventListener("keydown", handleKeydown);
	});
</script>

<template>
	<div ref="root" :class="cn('relative inline-flex', props.class)">
		<slot
			name="trigger"
			:open="open"
			:toggle="toggle"
			:trigger-props="{
				type: 'button',
				'aria-expanded': open,
				'aria-haspopup': 'dialog',
				onClick: toggle,
			}"
		/>
		<div
			v-if="open"
			role="dialog"
			:class="
				cn(
					'absolute z-50 min-w-48 rounded-lg border border-border bg-bg-base p-3 shadow-xl',
					panelClass,
				)
			"
		>
			<slot :close="close" />
		</div>
	</div>
</template>
