<script setup lang="ts">
	import {
		computed,
		nextTick,
		onBeforeUnmount,
		onMounted,
		ref,
		watch,
		type Component,
	} from "vue";
	import { Search } from "@lucide/vue";

	export interface CommandItem {
		label: string;
		value: string;
		group?: string;
		shortcut?: string;
		keywords?: string[];
		disabled?: boolean;
		icon?: Component;
	}

	const props = withDefaults(
		defineProps<{
			items: CommandItem[];
			placeholder?: string;
			emptyText?: string;
		}>(),
		{ placeholder: "Search commands...", emptyText: "No matching commands" },
	);
	const emit = defineEmits<{ select: [value: string] }>();
	const open = defineModel<boolean>("open", { default: false });
	const query = ref("");
	const activeIndex = ref(0);
	const search = ref<HTMLInputElement | null>(null);
	const dialog = ref<HTMLElement | null>(null);
	let returnFocus: HTMLElement | null = null;
	const results = computed(() =>
		props.items.filter((item) =>
			`${item.label} ${item.group ?? ""} ${(item.keywords ?? []).join(" ")}`
				.toLowerCase()
				.includes(query.value.toLowerCase()),
		),
	);

	function close() {
		open.value = false;
		query.value = "";
		activeIndex.value = 0;
	}
	function select(index: number) {
		const item = results.value[index];
		if (!item || item.disabled) return;
		emit("select", item.value);
		close();
	}
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === "Tab" && dialog.value) {
			const items = Array.from(
				dialog.value.querySelectorAll<HTMLElement>(
					'input:not([disabled]), button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
				),
			);
			const first = items[0];
			const last = items[items.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last?.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first?.focus();
			}
			return;
		}
		if (event.key === "Escape") {
			close();
			return;
		}
		if (event.key === "ArrowDown") {
			event.preventDefault();
			activeIndex.value = Math.min(
				results.value.length - 1,
				activeIndex.value + 1,
			);
		}
		if (event.key === "ArrowUp") {
			event.preventDefault();
			activeIndex.value = Math.max(0, activeIndex.value - 1);
		}
		if (event.key === "Enter") {
			event.preventDefault();
			select(activeIndex.value);
		}
	}
	function globalShortcut(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
			event.preventDefault();
			open.value = !open.value;
		}
	}
	watch(open, (value) => {
		if (value) {
			returnFocus = document.activeElement as HTMLElement | null;
			nextTick(() => search.value?.focus());
		}
		else {
			query.value = "";
			activeIndex.value = 0;
			returnFocus?.focus();
			returnFocus = null;
		}
	});
	onMounted(() => document.addEventListener("keydown", globalShortcut));
	onBeforeUnmount(() =>
		document.removeEventListener("keydown", globalShortcut),
	);
</script>

<template>
	<Teleport to="body">
		<div
			v-if="open"
			class="fixed inset-0 z-[10000] flex items-start justify-center bg-black/55 px-4 pt-[15vh] backdrop-blur-[2px]"
			@click.self="close"
			@keydown="handleKeydown"
		>
			<section
				ref="dialog"
				role="dialog"
				aria-modal="true"
				aria-label="Command palette"
				class="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-bg-base shadow-2xl"
			>
				<div class="flex items-center gap-3 border-b border-border px-4">
					<Search class="size-4 shrink-0 text-text-faint" />
					<input
						ref="search"
						v-model="query"
						:placeholder="placeholder"
						aria-label="Search commands"
						class="h-12 min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-faint"
						@input="activeIndex = 0"
					/>
					<kbd
						class="rounded border border-border px-1.5 py-0.5 text-[10px] text-text-faint"
						>ESC</kbd
					>
				</div>
				<div class="max-h-[55vh] overflow-y-auto p-2">
					<p
						v-if="!results.length"
						class="py-8 text-center text-sm text-text-faint"
					>
						{{ emptyText }}
					</p>
					<button
						v-for="(item, index) in results"
						:key="item.value"
						type="button"
						:disabled="item.disabled"
						class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left disabled:opacity-40"
						:class="
							index === activeIndex
								? 'bg-bg-muted text-text-primary'
								: 'text-text-muted hover:bg-bg-muted'
						"
						@mouseenter="activeIndex = index"
						@click="select(index)"
					>
						<component
							:is="item.icon"
							v-if="item.icon"
							class="size-4 shrink-0"
						/>
						<span class="min-w-0 flex-1"
							><span class="block truncate text-sm">{{ item.label }}</span
							><span v-if="item.group" class="block text-xs text-text-faint">{{
								item.group
							}}</span></span
						>
						<kbd v-if="item.shortcut" class="text-[10px] text-text-faint">{{
							item.shortcut
						}}</kbd>
					</button>
				</div>
				<footer
					class="flex items-center gap-4 border-t border-border px-4 py-2 text-[10px] text-text-faint"
				>
					<span>↑↓ Navigate</span><span>↵ Select</span><span>esc Close</span>
				</footer>
			</section>
		</div>
	</Teleport>
</template>
