<script setup lang="ts">
	import { computed, type HTMLAttributes } from "vue";
	import { ChevronRight, Crosshair, MapPin } from "@lucide/vue";
	import { cn } from "../utils/cn";

	export interface TargetOption {
		id: string | number;
		label: string;
		description?: string;
		distance?: number;
		category?: string;
		disabled?: boolean;
	}

	const props = withDefaults(
		defineProps<{
			items: TargetOption[];
			title?: string;
			emptyText?: string;
			maxDistance?: number;
			class?: HTMLAttributes["class"];
		}>(),
		{ title: "Nearby targets", emptyText: "No targets nearby" },
	);
	const selected = defineModel<string | number | null>({ default: null });
	const emit = defineEmits<{ select: [target: TargetOption] }>();
	const visibleItems = computed(() =>
		props.items.filter((item) => props.maxDistance === undefined || item.distance === undefined || item.distance <= props.maxDistance)
	);
	function choose(item: TargetOption) {
		if (item.disabled) return;
		selected.value = item.id;
		emit("select", item);
	}
</script>

<template>
	<section :class="cn('w-full overflow-hidden rounded-xl border border-border bg-bg-surface', props.class)" :aria-label="title">
		<header class="flex items-center justify-between border-b border-border px-3.5 py-3"><div class="flex items-center gap-2"><span class="flex size-7 items-center justify-center rounded-md bg-bg-muted text-text-muted"><Crosshair class="size-3.5" /></span><h2 class="text-sm font-semibold text-text-primary">{{ title }}</h2></div><span class="text-[10px] tabular-nums text-text-faint">{{ visibleItems.length }} nearby</span></header>
		<ul v-if="visibleItems.length" class="p-1.5">
			<li v-for="item in visibleItems" :key="item.id">
				<button type="button" :disabled="item.disabled" :aria-pressed="selected === item.id" class="group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-bg-muted focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-40" :class="selected === item.id ? 'bg-bg-muted' : ''" @click="choose(item)">
					<span class="size-1.5 shrink-0 rounded-full" :class="selected === item.id ? 'bg-inverse' : 'bg-text-faint'" />
					<span class="min-w-0 flex-1"><span class="block truncate text-xs font-medium text-text-primary">{{ item.label }}</span><span v-if="item.description || item.category" class="mt-0.5 block truncate text-[10px] text-text-faint">{{ item.category }}<template v-if="item.category && item.description"> · </template>{{ item.description }}</span></span>
					<span v-if="item.distance !== undefined" class="flex shrink-0 items-center gap-1 text-[10px] tabular-nums text-text-faint"><MapPin class="size-3" />{{ Math.round(item.distance) }} m</span><ChevronRight class="size-3.5 shrink-0 text-text-faint transition-transform group-hover:translate-x-0.5" />
				</button>
			</li>
		</ul>
		<p v-else class="px-4 py-8 text-center text-xs text-text-faint">{{ emptyText }}</p>
		<slot name="footer" />
	</section>
</template>
