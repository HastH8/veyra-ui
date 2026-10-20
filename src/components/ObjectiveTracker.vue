<script setup lang="ts">
	import { computed, watch, type HTMLAttributes } from "vue";
	import { Check, MapPin } from "@lucide/vue";
	import { cn } from "../utils/cn";

	export interface ObjectiveItem {
		id: string;
		label: string;
		description?: string;
		distance?: number | string;
		completed?: boolean;
	}

	const props = withDefaults(
		defineProps<{
			title?: string;
			objectives: ObjectiveItem[];
			showDistance?: boolean;
			mode?: "selectable" | "guided";
			class?: HTMLAttributes["class"];
		}>(),
		{ title: "Objectives", showDistance: true, mode: "selectable" },
	);
	const activeId = defineModel<string | null>({ default: null });
	const emit = defineEmits<{ complete: [id: string] }>();
	const completedCount = computed(
		() => props.objectives.filter((item) => item.completed).length,
	);
	const completion = computed(() =>
		props.objectives.length
			? Math.round((completedCount.value / props.objectives.length) * 100)
			: 0,
	);
	const currentObjective = computed(() =>
		props.objectives.find(
			(item) => item.id === activeId.value && !item.completed,
		),
	);
	function syncGuidedObjective() {
		if (props.mode !== "guided") return;
		const current = props.objectives.find((item) => item.id === activeId.value);
		if (current && !current.completed) return;
		activeId.value =
			props.objectives.find((item) => !item.completed)?.id ?? null;
	}
	watch(
		() => [props.mode, props.objectives, activeId.value],
		syncGuidedObjective,
		{ immediate: true, deep: true },
	);
</script>

<template>
	<section
		:class="
			cn(
				'w-full rounded-xl border border-border bg-bg-surface p-4',
				props.class,
			)
		"
		:aria-label="title"
	>
		<header class="mb-3 flex items-center justify-between gap-3">
			<div>
				<h2 class="text-sm font-semibold text-text-primary">{{ title }}</h2>
				<p class="mt-0.5 text-xs text-text-faint">
					{{ completedCount }} of {{ objectives.length }} complete
				</p>
			</div>
			<span
				class="rounded-md border border-border bg-bg-muted px-2 py-1 text-xs font-medium tabular-nums text-text-muted"
				>{{ completion }}%</span
			>
		</header>
		<div
			class="mb-3 h-1 overflow-hidden rounded-full bg-bg-muted"
			role="progressbar"
			:aria-valuenow="completion"
			aria-valuemin="0"
			aria-valuemax="100"
			:aria-label="`${title} completion`"
		>
			<div
				class="h-full rounded-full bg-inverse transition-[width]"
				:style="{ width: `${completion}%` }"
			/>
		</div>
		<ul class="flex flex-col gap-1.5">
			<li v-for="item in objectives" :key="item.id">
				<button
					type="button"
					:disabled="mode === 'guided'"
					class="flex w-full items-start gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-bg-muted focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-default disabled:hover:bg-transparent"
					:aria-current="activeId === item.id ? 'step' : undefined"
					@click="activeId = item.id"
				>
					<span
						class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border"
						:class="
							item.completed
								? 'border-inverse bg-inverse text-text-inverse'
								: activeId === item.id
									? 'border-text-primary text-text-primary'
									: 'border-border text-text-faint'
						"
					>
						<Check v-if="item.completed" class="size-3" /><span
							v-else
							class="size-1.5 rounded-full bg-current"
					/></span>
					<span class="min-w-0 flex-1"
						><span
							class="block text-xs font-medium"
							:class="
								item.completed
									? 'text-text-faint line-through'
									: 'text-text-primary'
							"
							>{{ item.label }}</span
						><span
							v-if="item.description"
							class="mt-0.5 block text-xs text-text-muted"
							>{{ item.description }}</span
						></span
					>
					<span
						v-if="showDistance && item.distance !== undefined"
						class="flex shrink-0 items-center gap-1 pt-0.5 text-[10px] tabular-nums text-text-faint"
						><MapPin class="size-3" />{{
							typeof item.distance === "number"
								? `${Math.round(item.distance)} m`
								: item.distance
						}}</span
					>
				</button>
			</li>
		</ul>
		<div
			v-if="mode === 'guided' && currentObjective"
			class="mt-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-bg-muted px-3 py-2.5"
		>
			<div class="min-w-0">
				<p
					class="text-[10px] font-semibold uppercase tracking-wider text-text-faint"
				>
					Current task
				</p>
				<p class="mt-0.5 truncate text-xs font-medium text-text-primary">
					{{ currentObjective.label }}
				</p>
			</div>
			<button
				type="button"
				class="shrink-0 rounded-md bg-inverse px-3 py-1.5 text-xs font-semibold text-text-inverse transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-ring"
				@click="emit('complete', currentObjective.id)"
			>
				Complete task
			</button>
		</div>
		<p
			v-else-if="mode === 'guided'"
			class="mt-3 rounded-lg bg-bg-muted px-3 py-2.5 text-xs font-medium text-success"
		>
			All tasks complete
		</p>
		<slot name="footer" />
	</section>
</template>
