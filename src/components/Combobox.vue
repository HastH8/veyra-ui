<script setup lang="ts">
	import {
		computed,
		nextTick,
		onBeforeUnmount,
		onMounted,
		ref,
		useId,
		watch,
		type HTMLAttributes,
	} from "vue";
	import { Check, ChevronDown, Search } from "@lucide/vue";
	import { cn } from "../utils/cn";

	export interface ComboboxOption {
		label: string;
		value: string;
		disabled?: boolean;
		description?: string;
	}

	const props = withDefaults(
		defineProps<{
			options: ComboboxOption[];
			label?: string;
			placeholder?: string;
			emptyText?: string;
			disabled?: boolean;
			class?: HTMLAttributes["class"];
		}>(),
		{
			placeholder: "Select an option",
			emptyText: "No results found",
			disabled: false,
		},
	);

	const model = defineModel<string>({ default: "" });
	const id = useId();
	const root = ref<HTMLElement | null>(null);
	const trigger = ref<HTMLElement | null>(null);
	const panel = ref<HTMLElement | null>(null);
	const panelStyle = ref<Record<string, string>>({});
	const searchInput = ref<HTMLInputElement | null>(null);
	const open = ref(false);
	const query = ref("");
	const activeIndex = ref(0);
	const selected = computed(() =>
		props.options.find((option) => option.value === model.value),
	);
	const filtered = computed(() =>
		props.options.filter((option) =>
			`${option.label} ${option.description ?? ""}`
				.toLowerCase()
				.includes(query.value.toLowerCase()),
		),
	);

	function setOpen(value: boolean) {
		if (props.disabled) return;
		open.value = value;
		if (value) {
			query.value = "";
			activeIndex.value = Math.max(
				0,
				filtered.value.findIndex((option) => option.value === model.value),
			);
			requestAnimationFrame(() => searchInput.value?.focus());
		}
	}
	function select(option: ComboboxOption) {
		if (option.disabled) return;
		model.value = option.value;
		open.value = false;
	}
	function moveActive(step: number) {
		const enabled = filtered.value
			.map((option, index) => ({ option, index }))
			.filter(({ option }) => !option.disabled);
		if (!enabled.length) return;
		const current = enabled.findIndex(
			({ index }) => index === activeIndex.value,
		);
		const next =
			current < 0
				? step > 0
					? 0
					: enabled.length - 1
				: (current + step + enabled.length) % enabled.length;
		activeIndex.value = enabled[next].index;
	}
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === "Escape") {
			open.value = false;
			return;
		}
		if (event.key === "ArrowDown") {
			event.preventDefault();
			moveActive(1);
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			moveActive(-1);
		} else if (event.key === "Enter" && open.value) {
			event.preventDefault();
			const option = filtered.value[activeIndex.value];
			if (option) select(option);
		}
	}
	function updatePanelPosition() {
		if (!trigger.value || !panel.value) return;
		const rect = trigger.value.getBoundingClientRect();
		const gap = 4;
		const viewportPadding = 8;
		const height = panel.value.offsetHeight;
		const spaceBelow = window.innerHeight - rect.bottom - gap - viewportPadding;
		const spaceAbove = rect.top - gap - viewportPadding;
		const placeAbove = spaceBelow < height && spaceAbove > spaceBelow;
		const top = placeAbove ? rect.top - height - gap : rect.bottom + gap;
		panelStyle.value = {
			left: `${rect.left}px`,
			width: `${rect.width}px`,
			top: `${Math.max(viewportPadding, Math.min(top, window.innerHeight - height - viewportPadding))}px`,
		};
	}
	function handlePositionChange() {
		if (open.value) updatePanelPosition();
	}
	function handleOutside(event: PointerEvent) {
		const target = event.target as Node;
		if (!root.value?.contains(target) && !panel.value?.contains(target))
			open.value = false;
	}
	// The list height changes while filtering, so re-anchor after each render
	watch([open, filtered], async () => {
		if (!open.value) return;
		await nextTick();
		updatePanelPosition();
	});
	onMounted(() => {
		document.addEventListener("pointerdown", handleOutside);
		window.addEventListener("resize", handlePositionChange);
		window.addEventListener("scroll", handlePositionChange, true);
	});
	onBeforeUnmount(() => {
		document.removeEventListener("pointerdown", handleOutside);
		window.removeEventListener("resize", handlePositionChange);
		window.removeEventListener("scroll", handlePositionChange, true);
	});
</script>

<template>
	<div
		ref="root"
		:class="cn('flex w-full flex-col gap-y-1.5', props.class)"
		@keydown="handleKeydown"
	>
		<label v-if="label" class="text-sm font-medium text-text-muted">{{
			label
		}}</label>
		<button
			ref="trigger"
			type="button"
			role="combobox"
			:aria-expanded="open"
			:aria-controls="id"
			:disabled="disabled"
			class="flex h-10 items-center justify-between gap-2 rounded-lg border border-border bg-bg-surface px-3 text-left text-sm text-text-primary hover:bg-bg-muted focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
			@click="setOpen(!open)"
		>
			<span :class="selected ? 'text-text-primary' : 'text-text-faint'">{{
				selected?.label ?? placeholder
			}}</span>
			<ChevronDown
				class="size-4 shrink-0 text-text-faint"
				:class="{ 'rotate-180': open }"
			/>
		</button>
		<Teleport to="body">
			<div
				v-if="open"
				:id="id"
				ref="panel"
				role="listbox"
				class="fixed z-[9999] rounded-lg border border-border bg-bg-base p-1.5 shadow-xl"
				:style="panelStyle"
				@keydown="handleKeydown"
			>
				<div class="flex items-center gap-2 border-b border-border px-2 pb-2">
					<Search class="size-4 text-text-faint" />
					<input
						ref="searchInput"
						v-model="query"
						type="text"
						aria-label="Search options"
						placeholder="Search..."
						class="h-8 min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-faint"
						@input="activeIndex = 0"
					/>
				</div>
				<div class="mt-1 max-h-52 overflow-y-auto">
					<p
						v-if="!filtered.length"
						class="px-2.5 py-5 text-center text-sm text-text-faint"
					>
						{{ emptyText }}
					</p>
					<button
						v-for="(option, index) in filtered"
						:key="option.value"
						type="button"
						role="option"
						:aria-selected="option.value === model"
						:disabled="option.disabled"
						class="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left hover:bg-bg-muted disabled:opacity-40"
						:class="{ 'bg-bg-muted': index === activeIndex }"
						@mouseenter="activeIndex = index"
						@click="select(option)"
					>
						<span class="min-w-0 flex-1"
							><span class="block truncate text-sm text-text-primary">{{
								option.label
							}}</span
							><span
								v-if="option.description"
								class="block truncate text-xs text-text-faint"
								>{{ option.description }}</span
							></span
						>
						<Check
							v-if="option.value === model"
							class="size-4 text-text-primary"
						/>
					</button>
				</div>
			</div>
		</Teleport>
	</div>
</template>
