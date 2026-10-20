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
	let activePointerId: number | undefined;
	let holdCompleted = false;
	const holdRequired = computed(() => Math.max(0, props.holdDuration));

	function stopHold(reset = true) {
		if (holdTimer) clearInterval(holdTimer);
		holdTimer = undefined;
		isHolding.value = false;
		activePointerId = undefined;
		if (reset) {
			progress.value = 0;
			holdCompleted = false;
		}
	}
	function completeHold() {
		stopHold(false);
		holdCompleted = true;
		progress.value = 100;
		emit("interact");
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
		holdCompleted = false;
		progress.value = 0;
		isHolding.value = true;
		const started = performance.now();
		holdTimer = setInterval(() => {
			if (props.disabled) {
				stopHold();
				return;
			}
			progress.value = Math.min(
				100,
				((performance.now() - started) / holdRequired.value) * 100,
			);
			if (progress.value >= 100) {
				completeHold();
			}
		}, 16);
	}
	function onPointerDown(event: PointerEvent) {
		if (!holdRequired.value) return;
		event.preventDefault();
		activePointerId = event.pointerId;
		(event.currentTarget as HTMLButtonElement).setPointerCapture(
			event.pointerId,
		);
		startHold();
	}
	function onPointerUp(event: PointerEvent) {
		if (activePointerId !== undefined && event.pointerId !== activePointerId)
			return;
		stopHold(!holdCompleted);
	}
	function onWindowBlur() {
		stopHold();
	}
	function onKeydown(event: KeyboardEvent) {
		if (
			!props.keyboardEnabled ||
			props.disabled ||
			event.repeat ||
			event.key.toLowerCase() !== props.keyLabel.toLowerCase() ||
			(event.target instanceof HTMLElement &&
				(event.target.isContentEditable ||
					/^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName)))
		)
			return;
		event.preventDefault();
		startHold();
	}
	function onKeyup(event: KeyboardEvent) {
		if (
			props.keyboardEnabled &&
			event.key.toLowerCase() === props.keyLabel.toLowerCase() &&
			isHolding.value
		)
			stopHold();
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
			stopHold(!holdCompleted);
		}
	}
	watch(
		() => props.disabled,
		(disabled) => {
			if (disabled) stopHold();
		},
	);
	onMounted(() => {
		window.addEventListener("keydown", onKeydown);
		window.addEventListener("keyup", onKeyup);
		window.addEventListener("blur", onWindowBlur);
	});
	onBeforeUnmount(() => {
		stopHold();
		window.removeEventListener("keydown", onKeydown);
		window.removeEventListener("keyup", onKeyup);
		window.removeEventListener("blur", onWindowBlur);
	});
</script>

<template>
	<div
		:class="
			cn(
				'w-full rounded-xl border border-border bg-bg-surface p-3',
				props.class,
			)
		"
	>
		<button
			type="button"
			:disabled="disabled"
			:aria-label="`${label}${description ? `: ${description}` : ''}. ${holdRequired ? `Hold ${keyLabel} to continue` : `Press ${keyLabel} to continue`}`"
			class="group flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-bg-muted focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50"
			@pointerdown="onPointerDown"
			@pointerup="onPointerUp"
			@lostpointercapture="onPointerUp"
			@pointercancel="stopHold()"
			@blur="onWindowBlur"
			@keydown="onButtonKeydown"
			@keyup="onButtonKeyup"
			@click="!holdRequired && activate()"
		>
			<kbd
				class="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-bg-muted text-sm font-semibold text-text-primary shadow-sm"
				>{{ keyLabel }}</kbd
			>
			<span class="min-w-0 flex-1">
				<span class="block truncate text-sm font-medium text-text-primary">{{
					label
				}}</span>
				<span
					v-if="description"
					class="mt-0.5 block truncate text-xs text-text-muted"
					>{{ description }}</span
				>
			</span>
			<ArrowUpRight
				class="size-4 shrink-0 text-text-faint transition-colors group-hover:text-text-primary"
			/>
		</button>
		<Progress
			v-if="holdRequired"
			class="mt-2 px-2"
			:value="progress"
			:label="
				holdCompleted ? 'Complete' : isHolding ? 'Keep holding' : undefined
			"
			color="var(--color-inverse)"
			size="sm"
			:transition-duration="0"
		/>
	</div>
</template>
