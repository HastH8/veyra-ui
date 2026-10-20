<script setup lang="ts">
	import { computed, ref, type HTMLAttributes } from "vue";
	import { ChevronRight, MoreHorizontal } from "@lucide/vue";
	import { cn } from "../utils/cn";

export interface BreadcrumbItem {
		label: string;
		href?: string;
		current?: boolean;
	}

	const props = withDefaults(
		defineProps<{
			items: BreadcrumbItem[];
			maxVisible?: number;
			class?: HTMLAttributes["class"];
		}>(),
		{},
	);

	const expanded = ref(false);
	const visibleItems = computed(() => {
		const maxVisible = Math.max(3, props.maxVisible ?? 4);

		if (expanded.value || props.items.length <= maxVisible) {
			return props.items.map((item, index) => ({ item, index }));
		}

		const tailCount = maxVisible - 2;

		return [
			{ item: props.items[0], index: 0 },
			{ item: null, index: -1 },
			...props.items.slice(-tailCount).map((item, index) => ({
				item,
				index: props.items.length - tailCount + index,
			})),
		];
	});

	function isCurrent(index: number, item: BreadcrumbItem) {
		return item.current ?? index === props.items.length - 1;
	}
</script>

<template>
	<nav aria-label="Breadcrumb" :class="cn('min-w-0', props.class)">
		<ol class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm">
			<li
				v-for="({ item, index }, visibleIndex) in visibleItems"
				:key="`${item?.label ?? 'collapsed'}-${index}`"
				class="inline-flex min-w-0 items-center gap-x-2"
			>
				<button
					v-if="!item"
					type="button"
					aria-label="Show hidden breadcrumb items"
					class="inline-flex size-6 shrink-0 items-center justify-center rounded text-text-faint hover:bg-bg-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-ring"
					@click="expanded = true"
				>
					<MoreHorizontal class="size-4" />
				</button>
				<span
					v-else-if="isCurrent(index, item) || !item.href"
					:aria-current="isCurrent(index, item) ? 'page' : undefined"
					:class="
						isCurrent(index, item)
							? 'truncate font-medium text-text-primary'
							: 'truncate text-text-faint'
					"
				>
					<slot name="item" :item="item" :index="index">{{ item.label }}</slot>
				</span>
				<a
					v-else
					:href="item.href"
					class="truncate text-text-muted transition-colors hover:text-text-primary focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
				>
					<slot name="item" :item="item" :index="index">{{ item.label }}</slot>
				</a>

				<span
					v-if="visibleIndex < visibleItems.length - 1"
					aria-hidden="true"
					class="inline-flex shrink-0 items-center text-text-faint"
				>
					<slot name="separator"><ChevronRight class="size-3.5" /></slot>
				</span>
			</li>
		</ol>
	</nav>
</template>
