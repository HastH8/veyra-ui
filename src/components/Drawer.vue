<script setup lang="ts">
	import {
		nextTick,
		onBeforeUnmount,
		onMounted,
		ref,
		useId,
		watch,
		type HTMLAttributes,
	} from "vue";
	import { X } from "@lucide/vue";
	import { cn } from "../utils/cn";

	const props = withDefaults(
		defineProps<{
			title?: string;
			description?: string;
			side?: "left" | "right";
			width?: string;
			closeOnBackdrop?: boolean;
			class?: HTMLAttributes["class"];
		}>(),
		{ side: "right", width: "24rem", closeOnBackdrop: true },
	);

	const open = defineModel<boolean>({ default: false });
	const titleId = useId();
	const descriptionId = useId();
	const panel = ref<HTMLElement | null>(null);
	let returnFocus: HTMLElement | null = null;
	const focusableSelector =
		'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

	function handleKeydown(event: KeyboardEvent) {
		if (!open.value) return;
		if (event.key === "Escape") {
			open.value = false;
			return;
		}
		if (event.key !== "Tab" || !panel.value) return;
		const items = Array.from(
			panel.value.querySelectorAll<HTMLElement>(focusableSelector),
		);
		if (!items.length) {
			event.preventDefault();
			panel.value.focus();
			return;
		}
		const first = items[0];
		const last = items[items.length - 1];
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	}

	function lockScroll(value: boolean) {
		document.body.style.overflow = value ? "hidden" : "";
	}

	watch(open, async (value) => {
		lockScroll(value);
		if (value) {
			returnFocus = document.activeElement as HTMLElement | null;
			await nextTick();
			panel.value?.querySelector<HTMLElement>(focusableSelector)?.focus();
		} else {
			returnFocus?.focus();
			returnFocus = null;
		}
	});
	onMounted(() => document.addEventListener("keydown", handleKeydown));
	onBeforeUnmount(() => {
		document.removeEventListener("keydown", handleKeydown);
		lockScroll(false);
	});
</script>

<template>
	<Teleport to="body">
		<Transition
			enter-active-class="transition-opacity duration-200"
			enter-from-class="opacity-0"
			leave-active-class="transition-opacity duration-150"
			leave-to-class="opacity-0"
		>
			<div
				v-if="open"
				class="fixed inset-0 z-[9998] bg-black/55 backdrop-blur-[2px]"
				@click.self="closeOnBackdrop && (open = false)"
			>
				<Transition
					appear
					enter-active-class="transition-transform duration-200 ease-out"
					:enter-from-class="
						side === 'right' ? 'translate-x-full' : '-translate-x-full'
					"
					leave-active-class="transition-transform duration-150 ease-in"
					:leave-to-class="
						side === 'right' ? 'translate-x-full' : '-translate-x-full'
					"
				>
					<section
						v-if="open"
						ref="panel"
						role="dialog"
						aria-modal="true"
						tabindex="-1"
						:aria-labelledby="title ? titleId : undefined"
						:aria-describedby="description ? descriptionId : undefined"
						:class="
							cn(
								'absolute inset-y-0 flex max-w-full flex-col border-border bg-bg-base shadow-2xl',
								side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
								props.class,
							)
						"
						:style="{ width, maxWidth: '100vw' }"
					>
						<header
							class="flex items-start gap-4 border-b border-border px-5 py-4"
						>
							<div class="min-w-0 flex-1">
								<h2
									v-if="title"
									:id="titleId"
									class="text-base font-semibold text-text-primary"
								>
									{{ title }}
								</h2>
								<p
									v-if="description"
									:id="descriptionId"
									class="mt-1 text-sm text-text-muted"
								>
									{{ description }}
								</p>
							</div>
							<button
								type="button"
								aria-label="Close panel"
								class="flex size-8 shrink-0 items-center justify-center rounded-md text-text-faint hover:bg-bg-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-ring"
								@click="open = false"
							>
								<X class="size-4" />
							</button>
						</header>
						<div class="min-h-0 flex-1 overflow-y-auto p-5"><slot /></div>
						<footer
							v-if="$slots.footer"
							class="flex items-center justify-end gap-2 border-t border-border px-5 py-4"
						>
							<slot name="footer" />
						</footer>
					</section>
				</Transition>
			</div>
		</Transition>
	</Teleport>
</template>
