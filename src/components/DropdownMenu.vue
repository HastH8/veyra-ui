<script setup lang="ts">
	import {
		onBeforeUnmount,
		onMounted,
		ref,
		type Component,
		type HTMLAttributes,
	} from "vue";
	import { ChevronDown } from "@lucide/vue";
	import { cn } from "../utils/cn";

	export type DropdownMenuItem =
		| { type: "separator" }
		| {
				type?: "item";
				label: string;
				value: string;
				shortcut?: string;
				disabled?: boolean;
				destructive?: boolean;
				icon?: Component;
		  };

	const props = withDefaults(
		defineProps<{
			items: DropdownMenuItem[];
			label?: string;
			class?: HTMLAttributes["class"];
		}>(),
		{ label: "Actions" },
	);
	const emit = defineEmits<{ select: [value: string] }>();
	const open = ref(false);
	const root = ref<HTMLElement | null>(null);
	const itemButtons = ref<HTMLButtonElement[]>([]);
	function close() {
		open.value = false;
	}
	function handleOutside(event: PointerEvent) {
		if (!root.value?.contains(event.target as Node)) close();
	}
	function handleKeys(event: KeyboardEvent) {
		if (event.key === "Escape") {
			close();
			return;
		}
		if (!open.value || !["ArrowDown", "ArrowUp"].includes(event.key)) return;
		event.preventDefault();
		const buttons = itemButtons.value.filter((button) => !button.disabled);
		const current = buttons.indexOf(
			document.activeElement as HTMLButtonElement,
		);
		const step = event.key === "ArrowDown" ? 1 : -1;
		buttons[(current + step + buttons.length) % buttons.length]?.focus();
	}
	function choose(value: string) {
		emit("select", value);
		close();
	}

	onMounted(() => {
		document.addEventListener("pointerdown", handleOutside);
		document.addEventListener("keydown", handleKeys);
	});
	onBeforeUnmount(() => {
		document.removeEventListener("pointerdown", handleOutside);
		document.removeEventListener("keydown", handleKeys);
	});
</script>

<template>
	<div ref="root" :class="cn('relative inline-flex', props.class)">
		<button
			type="button"
			:aria-expanded="open"
			aria-haspopup="menu"
			class="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary hover:bg-bg-muted focus-visible:outline-2 focus-visible:outline-ring"
			@click="open = !open"
		>
			<slot>{{ label }}</slot
			><ChevronDown
				class="size-4 text-text-faint"
				:class="{ 'rotate-180': open }"
			/>
		</button>
		<div
			v-if="open"
			role="menu"
			class="absolute left-0 top-full z-50 mt-2 min-w-52 rounded-lg border border-border bg-bg-base p-1.5 shadow-xl"
		>
			<template
				v-for="(item, index) in items"
				:key="item.type === 'separator' ? `separator-${index}` : item.value"
			>
				<div
					v-if="item.type === 'separator'"
					role="separator"
					class="my-1.5 h-px bg-border"
				/>
				<button
					v-else
					ref="itemButtons"
					type="button"
					role="menuitem"
					:disabled="item.disabled"
					class="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm hover:bg-bg-muted focus-visible:bg-bg-muted focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40"
					:class="
						item.destructive
							? 'text-danger hover:text-danger/80'
							: 'text-text-muted hover:text-text-primary'
					"
					@click="choose(item.value)"
				>
					<component :is="item.icon" v-if="item.icon" class="size-4 shrink-0" />
					<span class="flex-1">{{ item.label }}</span>
					<kbd v-if="item.shortcut" class="text-[10px] text-text-faint">{{
						item.shortcut
					}}</kbd>
				</button>
			</template>
		</div>
	</div>
</template>
