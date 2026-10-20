<script setup lang="ts">
	import { onBeforeUnmount, ref, watch, type HTMLAttributes } from "vue";
	import { CircleAlert, CircleCheck, Info, X } from "@lucide/vue";
	import { cn } from "../utils/cn";

	const props = withDefaults(
		defineProps<{
			title: string;
			description?: string;
			variant?: "default" | "success" | "danger";
			duration?: number;
			dismissible?: boolean;
			class?: HTMLAttributes["class"];
		}>(),
		{ variant: "default", duration: 4000, dismissible: true },
	);
	const open = defineModel<boolean>("open", { default: false });
	const emit = defineEmits<{ close: [] }>();
	const timer = ref<ReturnType<typeof setTimeout>>();
	const variants = {
		default: { icon: Info, color: "text-sky-400" },
		success: { icon: CircleCheck, color: "text-emerald-400" },
		danger: { icon: CircleAlert, color: "text-red-400" },
	};
	function close() {
		open.value = false;
		emit("close");
	}
	function clearTimer() {
		if (timer.value) clearTimeout(timer.value);
	}
	watch(open, (value) => {
		clearTimer();
		if (value && props.duration > 0)
			timer.value = setTimeout(close, props.duration);
	});
	onBeforeUnmount(clearTimer);
</script>

<template>
	<Transition
		enter-active-class="transition duration-200"
		enter-from-class="translate-y-2 opacity-0"
		leave-active-class="transition duration-150"
		leave-to-class="translate-y-1 opacity-0"
	>
		<div
			v-if="open"
			:role="variant === 'danger' ? 'alert' : 'status'"
			:class="cn('flex w-full max-w-sm items-start gap-3 rounded-lg border border-border bg-bg-base p-3.5 shadow-xl', props.class)"
		>
			<component
				:is="variants[variant].icon"
				class="mt-0.5 size-4 shrink-0"
				:class="variants[variant].color"
			/>
			<div class="min-w-0 flex-1">
				<p class="text-sm font-semibold text-text-primary">{{ title }}</p>
				<p
					v-if="description || $slots.default"
					class="mt-0.5 text-xs leading-relaxed text-text-muted"
				>
					<slot>{{ description }}</slot>
				</p>
				<div v-if="$slots.action" class="mt-2"><slot name="action" /></div>
			</div>
			<button
				v-if="dismissible"
				type="button"
				aria-label="Dismiss notification"
				class="flex size-6 shrink-0 items-center justify-center rounded text-text-faint hover:bg-bg-muted hover:text-text-primary"
				@click="close"
			>
				<X class="size-3.5" />
			</button>
		</div>
	</Transition>
</template>
