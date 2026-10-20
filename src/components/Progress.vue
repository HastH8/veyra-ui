<script setup lang="ts">
	import { computed, type HTMLAttributes } from "vue";
	import { cn } from "../utils/cn";

	const props = withDefaults(
		defineProps<{
			value?: number;
			max?: number;
			label?: string;
			showValue?: boolean;
			color?: string;
			size?: "sm" | "md" | "lg";
			indeterminate?: boolean;
			striped?: boolean;
			class?: HTMLAttributes["class"];
		}>(),
		{
			value: 0,
			max: 100,
			showValue: false,
			size: "md",
			indeterminate: false,
			striped: false,
		},
	);

	const percent = computed(() =>
		props.max > 0
			? Math.min(100, Math.max(0, (props.value / props.max) * 100))
			: 0,
	);

	const heights = {
		sm: "h-1",
		md: "h-1.5",
		lg: "h-2.5",
	};
</script>

<template>
	<div :class="cn('flex w-full flex-col gap-y-1.5', props.class)">
		<div
			v-if="label || showValue"
			class="flex items-center justify-between gap-x-2 text-xs"
		>
			<span class="font-medium text-text-muted">{{ label }}</span>
			<span v-if="showValue" class="text-text-faint"
				>{{ Math.round(percent) }}%</span
			>
		</div>

		<div
			role="progressbar"
			:aria-valuenow="
				indeterminate ? undefined : Math.min(max, Math.max(0, value))
			"
			:aria-valuemin="indeterminate ? undefined : 0"
			:aria-valuemax="max"
			:aria-label="label"
			:aria-busy="indeterminate"
			:class="
				cn('w-full overflow-hidden rounded-full bg-bg-muted', heights[size])
			"
		>
			<div
				:class="[
					'h-full rounded-full transition-[width] duration-300',
					indeterminate
						? 'w-2/5 animate-[progress-indeterminate_1.4s_ease-in-out_infinite]'
						: '',
					striped
						? 'bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.22)_25%,rgba(255,255,255,.22)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.22)_75%)] bg-size-[1rem_1rem]'
						: '',
				]"
				:style="{
					width: indeterminate ? undefined : `${percent}%`,
					backgroundColor: color || 'var(--color-inverse)',
					backgroundImage:
						striped && !indeterminate
							? 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,.22) 25%, rgba(255,255,255,.22) 50%, transparent 50%, transparent 75%, rgba(255,255,255,.22) 75%)'
							: undefined,
					backgroundSize: striped ? '1rem 1rem' : undefined,
				}"
			/>
		</div>
	</div>
</template>

<style scoped>
	@keyframes progress-indeterminate {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(250%);
		}
	}
</style>
