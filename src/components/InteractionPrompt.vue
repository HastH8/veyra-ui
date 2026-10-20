<script setup lang="ts">
	import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
	import { ArrowUpRight } from "@lucide/vue";
	import { cn } from "../utils/cn";
	import Progress from "./Progress.vue";

	const props = withDefaults(
		defineProps<{
			label: string;
			description?: string;
			keyLabel?: string;
			holdDuration?: number;
			keyboardEnabled?: boolean;
			disabled?: boolean;
			class?: string;
		}>(),
		{
			keyLabel: "E",
			holdDuration: 0,
			keyboardEnabled: false,
			disabled: false,
		},
	);

	const emit = defineEmits<{ interact: [] }>();
	const progress = ref(0);
	const isHolding = ref(false);
	let holdTimer: ReturnType<typeof setInterval> | undefined;
	const holdRequired = computed(() => Math.max(0, props.holdDuration));

	function clearHold() {
		if (holdTimer) clearInterval(holdTimer);
		holdTimer = undefined;
		isHolding.value = false;
		progress.value = 0;
	}
	function activate() {
		if (props.disabled || isHolding.value) return;
		emit("interact");
	}
	function startHold() {
		if (props.disabled) return;
		if (!holdRequired.value) {
			activate();
			return;
		}
		if (isHolding.value) return;
		isHolding.value = true;
		const started = performance.now();
		holdTimer = setInterval(() => {
			if (props.disabled) {
				clearHold();
				return;
			}
			progress.value = Math.min(100, ((performance.now() - started) / holdRequired.value) * 100);
			if (progress.value >= 100) {
				clearHold();
				emit("interact");
			}
		}, 16);
	}
	function onKeydown(event: KeyboardEvent) {
		if (
			!props.keyboardEnabled ||
			props.disabled ||
			event.repeat ||
			event.key.toLowerCase() !== props.keyLabel.toLowerCase() ||
			(event.target instanceof HTMLElement &&
				(event.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)))
		) return;
		event.preventDefault();
		startHold();
	}
	function onKeyup(event: KeyboardEvent) {
		if (props.keyboardEnabled && event.key.toLowerCase() === props.keyLabel.toLowerCase() && isHolding.value) clearHold();
	}
	function onButtonKeydown(event: KeyboardEvent) {
		if (holdRequired.value && (event.key === "Enter" || event.key === " ")) {
			event.preventDefault();
			if (!event.repeat) startHold();
		}
	}
	function onButtonKeyup(event: KeyboardEvent) {
		if (holdRequired.value && (event.key === "Enter" || event.key === " ")) {
			event.preventDefault();
			clearHold();
		}
	}
	watch(() => props.disabled, (disabled) => {
		if (disabled) clearHold();
	});
	onMounted(() => {
		window.addEventListener("keydown", onKeydown);
		window.addEventListener("keyup", onKeyup);
		window.addEventListener("blur", clearHold);
	});
	onBeforeUnmount(() => {
		clearHold();
		window.removeEventListener("keydown", onKeydown);
		window.removeEventListener("keyup", onKeyup);
		window.removeEventListener("blur", clearHold);
	});
</script>

<template>
	<div :class="cn('w-full rounded-xl border border-border bg-bg-surface p-3', props.class)">
		<button
			type="button"
			:disabled="disabled"
			:aria-label="`${label}${description ? `: ${description}` : ''}. ${holdRequired ? `Hold ${keyLabel} to continue` : `Press ${keyLabel} to continue`}`"
			class="group flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-bg-muted focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50"
			@pointerdown="holdRequired && startHold()"
			@pointerup="holdRequired && clearHold()"
			@pointerleave="holdRequired && clearHold()"
			@pointercancel="clearHold"
			@blur="clearHold"
			@keydown="onButtonKeydown"
			@keyup="onButtonKeyup"
			@click="!holdRequired && activate()"
		>
			<kbd class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-bg-muted text-sm font-semibold text-text-primary shadow-sm">{{ keyLabel }}</kbd>
			<span class="min-w-0 flex-1">
				<span class="block truncate text-sm font-medium text-text-primary">{{ label }}</span>
				<span v-if="description" class="mt-0.5 block truncate text-xs text-text-muted">{{ description }}</span>
			</span>
			<ArrowUpRight class="size-4 shrink-0 text-text-faint transition-colors group-hover:text-text-primary" />
		</button>
		<Progress v-if="holdRequired" class="mt-2 px-2" :value="progress" :label="isHolding ? 'Keep holding' : undefined" color="var(--color-inverse)" size="sm" />
	</div>
</template>
