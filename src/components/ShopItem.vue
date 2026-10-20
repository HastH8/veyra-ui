<script setup lang="ts">
	import { computed, watch, type HTMLAttributes } from "vue";
	import { Minus, Plus } from "@lucide/vue";
	import { cn } from "../utils/cn";
	import Button from "./Button.vue";

	const props = withDefaults(
		defineProps<{
			name: string;
			description?: string;
			price: number;
			currency?: string;
			stock?: number;
			mode?: "buy" | "sell";
			actionLabel?: string;
			disabled?: boolean;
			class?: HTMLAttributes["class"];
		}>(),
		{ currency: "$", mode: "buy", disabled: false },
	);

	const quantity = defineModel<number>({ default: 1 });
	const emit = defineEmits<{ confirm: [payload: { quantity: number; total: number }] }>();
	const maxQuantity = computed(() =>
		Math.max(
			1,
			props.stock === undefined
				? 99
				: Number.isFinite(props.stock)
					? Math.floor(props.stock)
					: 0,
		),
	);
	const outOfStock = computed(
		() => props.stock !== undefined && (!Number.isFinite(props.stock) || props.stock < 1),
	);
	const unitPrice = computed(() => Number.isFinite(props.price) ? Math.max(0, props.price) : 0);
	const total = computed(() => unitPrice.value * quantity.value);
	const actionText = computed(() => props.actionLabel ?? (props.mode === "buy" ? "Buy" : "Sell"));

	watch(
		[quantity, maxQuantity],
		([value, max]) => {
			const normalized = Math.min(max, Math.max(1, Math.trunc(value || 1)));
			if (normalized !== value) quantity.value = normalized;
		},
		{ immediate: true },
	);

	function changeQuantity(amount: number) {
		quantity.value = Math.min(maxQuantity.value, Math.max(1, quantity.value + amount));
	}
	function confirm() {
		if (props.disabled || outOfStock.value) return;
		emit("confirm", { quantity: quantity.value, total: total.value });
	}
</script>

<template>
	<article :class="cn('w-full rounded-xl border border-border bg-bg-surface p-4', props.class)">
		<div class="flex items-start gap-3">
			<div class="flex size-12 shrink-0 items-center justify-center rounded-lg border border-border bg-bg-muted text-text-muted">
				<slot name="icon"><span class="text-xs font-semibold uppercase tracking-wide">{{ name.slice(0, 2) }}</span></slot>
			</div>
			<div class="min-w-0 flex-1">
				<div class="flex items-start justify-between gap-3">
					<div class="min-w-0"><h3 class="truncate text-sm font-semibold text-text-primary">{{ name }}</h3><p v-if="description" class="mt-1 text-xs text-text-muted">{{ description }}</p></div>
						<span class="shrink-0 text-sm font-semibold text-text-primary">{{ currency }}{{ unitPrice.toLocaleString() }}</span>
				</div>
				<p v-if="stock !== undefined" class="mt-2 text-xs text-text-faint">{{ Number.isFinite(stock) ? Math.max(0, Math.floor(stock)) : 0 }} in stock</p>
			</div>
		</div>
		<div class="mt-4 flex items-center gap-3 border-t border-border pt-3">
			<div class="flex h-9 items-center rounded-md border border-border bg-bg-muted">
				<button type="button" :disabled="disabled || quantity <= 1" aria-label="Decrease quantity" class="flex size-8 items-center justify-center text-text-muted hover:text-text-primary disabled:opacity-40" @click="changeQuantity(-1)"><Minus class="size-3.5" /></button>
				<output class="min-w-7 text-center text-sm tabular-nums text-text-primary">{{ quantity }}</output>
				<button type="button" :disabled="disabled || quantity >= maxQuantity" aria-label="Increase quantity" class="flex size-8 items-center justify-center text-text-muted hover:text-text-primary disabled:opacity-40" @click="changeQuantity(1)"><Plus class="size-3.5" /></button>
			</div>
			<div class="min-w-0 flex-1 text-right"><p class="text-[10px] uppercase tracking-wide text-text-faint">Total</p><p class="text-sm font-semibold tabular-nums text-text-primary">{{ currency }}{{ total.toLocaleString() }}</p></div>
								<Button size="sm" :disabled="disabled || outOfStock" @click="confirm">{{ outOfStock ? "Out of stock" : actionText }}</Button>
		</div>
	</article>
</template>
