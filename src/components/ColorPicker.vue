<script setup lang="ts">
	import {
		computed,
		nextTick,
		onBeforeUnmount,
		onMounted,
		ref,
		watch,
		type HTMLAttributes,
	} from "vue";
	import { Check, ChevronDown, X } from "@lucide/vue";
	import { cn } from "../utils/cn";

	const props = withDefaults(
		defineProps<{
			label?: string;
			disabled?: boolean;
			// false shows only the color area, hue, opacity and the hex input
			detailed?: boolean;
			presets?: string[];
			class?: HTMLAttributes["class"];
		}>(),
		{
			disabled: false,
			detailed: true,
			presets: () => [],
		},
	);

	const model = defineModel<string>({ default: "#6366f1" });
	const rootRef = ref<HTMLElement | null>(null);
	const triggerRef = ref<HTMLElement | null>(null);
	const panelRef = ref<HTMLElement | null>(null);
	const panelStyle = ref<Record<string, string>>({});
	const open = ref(false);
	const hexInput = ref(model.value);
	const format = ref<"hex" | "rgb" | "hsl">("hex");

	function hexToHsv(hex: string) {
		const normalized = /^#[\da-f]{3}$/i.test(hex)
			? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
			: hex;
		const value = normalized.match(
			/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})([\da-f]{2})?$/i,
		);

		if (!value)
			return { hue: 258, saturation: 0.6, brightness: 0.95, alpha: 1 };

		const [red, green, blue] = [1, 2, 3].map(
			(index) => parseInt(value[index], 16) / 255,
		);
		const max = Math.max(red, green, blue);
		const min = Math.min(red, green, blue);
		const delta = max - min;
		let hue = 0;

		if (delta) {
			if (max === red) hue = 60 * (((green - blue) / delta) % 6);
			else if (max === green) hue = 60 * ((blue - red) / delta + 2);
			else hue = 60 * ((red - green) / delta + 4);
		}

		return {
			hue: (hue + 360) % 360,
			saturation: max === 0 ? 0 : delta / max,
			brightness: max,
			alpha: value[4] ? parseInt(value[4], 16) / 255 : 1,
		};
	}

	function hsvToRgb(hue: number, saturation: number, brightness: number) {
		const chroma = brightness * saturation;
		const segment = hue / 60;
		const intermediate = chroma * (1 - Math.abs((segment % 2) - 1));
		const offset = brightness - chroma;
		const rgb =
			segment < 1
				? [chroma, intermediate, 0]
				: segment < 2
					? [intermediate, chroma, 0]
					: segment < 3
						? [0, chroma, intermediate]
						: segment < 4
							? [0, intermediate, chroma]
							: segment < 5
								? [intermediate, 0, chroma]
								: [chroma, 0, intermediate];

		return rgb.map((channel) => Math.round((channel + offset) * 255));
	}

	function hsvToHex(
		hue: number,
		saturation: number,
		brightness: number,
		alpha = 1,
	) {
		const hex = hsvToRgb(hue, saturation, brightness)
			.map((channel) => channel.toString(16).padStart(2, "0"))
			.join("");

		return `#${hex}${
			alpha < 1
				? Math.round(alpha * 255)
						.toString(16)
						.padStart(2, "0")
				: ""
		}`;
	}

	const color = ref(hexToHsv(model.value));
	const opacity = computed({
		get: () => color.value.alpha * 100,
		set: (value: number) => {
			color.value.alpha = value / 100;
			commitColor();
		},
	});
	const hue = computed({
		get: () => color.value.hue,
		set: (value: number) => {
			color.value.hue = value;
			commitColor();
		},
	});
	const planeStyle = computed(() => ({
		backgroundColor: `hsl(${color.value.hue} 100% 50%)`,
	}));
	const thumbStyle = computed(() => ({
		left: `${color.value.saturation * 100}%`,
		top: `${(1 - color.value.brightness) * 100}%`,
	}));
	const validHex = computed(() =>
		/^#(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i.test(hexInput.value),
	);
	const formattedColor = computed(() => {
		const { hue, saturation, brightness, alpha } = color.value;
		const [red, green, blue] = hsvToRgb(hue, saturation, brightness);

		if (format.value === "rgb")
			return `rgba(${red}, ${green}, ${blue}, ${alpha.toFixed(2)})`;
		if (format.value === "hsl") {
			const lightness = brightness * (1 - saturation / 2);
			const hslSaturation =
				lightness === 0 || lightness === 1
					? 0
					: (brightness - lightness) / Math.min(lightness, 1 - lightness);

			return `hsla(${Math.round(hue)}, ${Math.round(hslSaturation * 100)}%, ${Math.round(lightness * 100)}%, ${alpha.toFixed(2)})`;
		}

		return model.value.toUpperCase();
	});

	function commitColor() {
		const hex = hsvToHex(
			color.value.hue,
			color.value.saturation,
			color.value.brightness,
			color.value.alpha,
		);
		model.value = hex;
		hexInput.value = hex;
	}

	function syncFromHex(hex: string) {
		color.value = hexToHsv(hex);
		hexInput.value = hex;
	}

	watch(model, (value) => {
		if (value.toLowerCase() !== hexInput.value.toLowerCase())
			syncFromHex(value);
	});

	function updatePlane(event: PointerEvent) {
		const plane = event.currentTarget as HTMLElement;
		const bounds = plane.getBoundingClientRect();

		color.value.saturation = Math.max(
			0,
			Math.min(1, (event.clientX - bounds.left) / bounds.width),
		);
		color.value.brightness =
			1 -
			Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
		commitColor();
	}

	function startPlaneSelection(event: PointerEvent) {
		if (props.disabled) return;

		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
		updatePlane(event);
	}

	function handlePlaneKeys(event: KeyboardEvent) {
		const step = event.shiftKey ? 0.05 : 0.01;

		if (event.key === "ArrowLeft")
			color.value.saturation = Math.max(0, color.value.saturation - step);
		else if (event.key === "ArrowRight")
			color.value.saturation = Math.min(1, color.value.saturation + step);
		else if (event.key === "ArrowUp")
			color.value.brightness = Math.min(1, color.value.brightness + step);
		else if (event.key === "ArrowDown")
			color.value.brightness = Math.max(0, color.value.brightness - step);
		else return;

		event.preventDefault();
		commitColor();
	}

	function updateHex(value: string) {
		hexInput.value = value;

		if (validHex.value) {
			color.value = hexToHsv(value);
			model.value = hsvToHex(
				color.value.hue,
				color.value.saturation,
				color.value.brightness,
				color.value.alpha,
			);
		}
	}

	function choosePreset(value: string) {
		syncFromHex(value);
		model.value = hsvToHex(
			color.value.hue,
			color.value.saturation,
			color.value.brightness,
			color.value.alpha,
		);
	}

	function copyColor() {
		void navigator.clipboard?.writeText(formattedColor.value);
	}

	function updatePanelPosition() {
		const trigger = triggerRef.value;
		const panel = panelRef.value;

		if (!trigger || !panel) return;

		const rect = trigger.getBoundingClientRect();
		const gap = 8;
		const viewportPadding = 8;
		const spaceBelow = window.innerHeight - rect.bottom - gap - viewportPadding;
		const spaceAbove = rect.top - gap - viewportPadding;
		const placeAbove =
			spaceBelow < panel.offsetHeight && spaceAbove > spaceBelow;
		const top = placeAbove
			? rect.top - panel.offsetHeight - gap
			: rect.bottom + gap;

		panelStyle.value = {
			left: `${Math.max(viewportPadding, Math.min(rect.left, window.innerWidth - panel.offsetWidth - viewportPadding))}px`,
			top: `${Math.max(viewportPadding, Math.min(top, window.innerHeight - panel.offsetHeight - viewportPadding))}px`,
			maxHeight: `${window.innerHeight - viewportPadding * 2}px`,
		};
	}

	function handleOutsideClick(event: PointerEvent) {
		const target = event.target as Node;

		if (!rootRef.value?.contains(target) && !panelRef.value?.contains(target))
			open.value = false;
	}

	function handlePositionChange() {
		if (open.value) updatePanelPosition();
	}

	watch(open, async (isOpen) => {
		if (!isOpen) return;

		await nextTick();
		updatePanelPosition();
	});

	onMounted(() => {
		document.addEventListener("pointerdown", handleOutsideClick);
		window.addEventListener("resize", handlePositionChange);
		window.addEventListener("scroll", handlePositionChange, true);
	});
	onBeforeUnmount(() => {
		document.removeEventListener("pointerdown", handleOutsideClick);
		window.removeEventListener("resize", handlePositionChange);
		window.removeEventListener("scroll", handlePositionChange, true);
	});
</script>

<template>
	<div
		ref="rootRef"
		:class="cn('relative flex w-full flex-col gap-y-2', props.class)"
		@keydown.esc="open = false"
	>
		<label v-if="label" class="text-sm font-medium text-text-muted">{{
			label
		}}</label>

		<button
			ref="triggerRef"
			type="button"
			:disabled="disabled"
			:aria-expanded="open"
			aria-haspopup="dialog"
			:aria-label="label ? `Choose ${label.toLowerCase()}` : 'Choose color'"
			class="inline-flex min-h-10 w-full max-w-64 items-center gap-x-2.5 rounded-lg border border-border bg-bg-surface px-2.5 py-1.5 text-left transition-colors hover:bg-bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"
			@click="open = !open"
		>
			<span
				class="size-7 shrink-0 rounded-md border border-border shadow-inner"
				:style="{ backgroundColor: model }"
			/>
			<span class="flex min-w-0 flex-1 flex-col">
				<span class="text-xs font-medium text-text-primary">Custom color</span>
				<span
					class="truncate font-mono text-[10px] uppercase text-text-faint"
					>{{ model }}</span
				>
			</span>
			<ChevronDown
				class="size-4 text-text-faint transition-transform"
				:class="{ 'rotate-180': open }"
			/>
		</button>

		<Teleport to="body">
			<div
				v-if="open"
				ref="panelRef"
				role="dialog"
				:aria-label="label ? `${label} picker` : 'Color picker'"
				class="fixed z-[9999] w-72 max-w-[calc(100vw-1rem)] overflow-y-auto rounded-xl border border-border bg-bg-base p-3 shadow-xl"
				:style="panelStyle"
				@keydown.esc="open = false"
			>
				<div v-if="detailed" class="mb-3 flex items-center justify-between">
					<div>
						<p class="text-sm font-semibold text-text-primary">Choose a color</p>
						<p class="mt-0.5 text-xs text-text-faint">
							Pick a shade or enter a hex value
						</p>
					</div>
					<button
						type="button"
						aria-label="Close color picker"
						class="flex size-7 items-center justify-center rounded-md text-text-faint hover:bg-bg-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-ring"
						@click="open = false"
					>
						<X class="size-4" />
					</button>
				</div>

				<div
					role="slider"
					aria-label="Color saturation and brightness"
					aria-valuemin="0"
					aria-valuemax="100"
					:aria-valuenow="Math.round(color.saturation * 100)"
					tabindex="0"
					:style="planeStyle"
					class="relative h-28 touch-none cursor-crosshair overflow-hidden rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
					@pointerdown="startPlaneSelection"
					@pointermove="(event) => event.buttons && updatePlane(event)"
					@keydown="handlePlaneKeys"
				>
					<div
						class="absolute inset-0 bg-linear-to-r from-white to-transparent"
					/>
					<div
						class="absolute inset-0 bg-linear-to-t from-black to-transparent"
					/>
					<span
						class="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_1px_4px_#0009]"
						:style="thumbStyle"
					/>
				</div>

				<label
					class="mt-3 block text-xs font-medium text-text-muted"
					for="color-picker-hue"
					>Hue</label
				>
				<input
					id="color-picker-hue"
					v-model.number="hue"
					aria-label="Hue"
					type="range"
					min="0"
					max="359"
					class="hue-slider mt-2 h-3 w-full cursor-pointer appearance-none rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
				/>

				<label
					class="mt-3 block text-xs font-medium text-text-muted"
					for="color-picker-opacity"
					>Opacity
					<span class="text-text-faint">{{ Math.round(opacity) }}%</span></label
				>
				<input
					id="color-picker-opacity"
					v-model.number="opacity"
					aria-label="Opacity"
					type="range"
					min="0"
					max="100"
					class="mt-1 h-1.5 w-full cursor-pointer accent-inverse"
				/>

				<div class="mb-1 mt-3 flex items-center justify-between">
					<p class="text-xs font-medium text-text-muted">Color value</p>
					<div
						v-if="detailed"
						class="flex items-center gap-0.5 rounded-md border border-border bg-bg-surface p-0.5"
						role="group"
						aria-label="Color format"
					>
						<button
							v-for="option in ['hex', 'rgb', 'hsl'] as const"
							:key="option"
							type="button"
							:aria-pressed="format === option"
							class="rounded px-1.5 py-0.5 text-[9px] font-medium uppercase text-text-faint hover:text-text-primary"
							:class="{ 'bg-bg-muted text-text-primary': format === option }"
							@click="format = option"
						>
							{{ option }}
						</button>
					</div>
				</div>
				<div class="flex items-center gap-2">
					<span
						class="size-8 shrink-0 rounded-md border border-border"
						:style="{ backgroundColor: model }"
					/>
					<label class="sr-only" for="color-picker-hex"
						>Selected color value</label
					>
					<input
						id="color-picker-hex"
						:value="format === 'hex' ? hexInput : formattedColor"
						type="text"
						inputmode="text"
						spellcheck="false"
						maxlength="9"
						:readonly="format !== 'hex'"
						:aria-invalid="format === 'hex' ? !validHex : undefined"
						class="h-8 min-w-0 flex-1 rounded-md border border-border bg-bg-surface px-2 font-mono text-[10px] uppercase text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
						@input="updateHex(($event.target as HTMLInputElement).value)"
						@blur="!validHex && (hexInput = model)"
						@keydown.enter="!validHex && (hexInput = model)"
					/>
					<button
						v-if="detailed"
						type="button"
						aria-label="Copy color"
						class="flex h-8 items-center gap-1 rounded-md border border-border bg-bg-surface px-2 text-[11px] text-text-muted transition-colors hover:bg-bg-muted hover:text-text-primary"
						@click="copyColor"
					>
						<Check class="size-3.5" /> Copy
					</button>
				</div>

				<div v-if="detailed && presets.length" class="mt-3 border-t border-border pt-3">
					<p class="mb-2 text-xs font-medium text-text-muted">Presets</p>
					<div class="flex flex-wrap gap-1.5">
						<button
							v-for="preset in presets"
							:key="preset"
							type="button"
							:aria-label="`Use ${preset}`"
							:aria-pressed="model.toLowerCase() === preset.toLowerCase()"
							class="size-6 cursor-pointer rounded-md border border-border transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
							:class="{
								'ring-2 ring-ring ring-offset-2 ring-offset-bg-base':
									model.toLowerCase() === preset.toLowerCase(),
							}"
							:style="{ backgroundColor: preset }"
							@click="choosePreset(preset)"
						/>
					</div>
				</div>
			</div>
		</Teleport>
	</div>
</template>

<style scoped>
	.hue-slider {
		background: linear-gradient(
			to right,
			#f00,
			#ff0,
			#0f0,
			#0ff,
			#00f,
			#f0f,
			#f00
		);
	}

	.hue-slider::-webkit-slider-thumb {
		width: 16px;
		height: 16px;
		appearance: none;
		border: 2px solid white;
		border-radius: 9999px;
		background: hsl(v-bind("color.hue") 100% 50%);
		box-shadow: 0 1px 4px #0008;
	}

	.hue-slider::-moz-range-thumb {
		width: 12px;
		height: 12px;
		border: 2px solid white;
		border-radius: 9999px;
		background: hsl(v-bind("color.hue") 100% 50%);
		box-shadow: 0 1px 4px #0008;
	}
</style>
