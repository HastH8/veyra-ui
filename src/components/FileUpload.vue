<script setup lang="ts">
	import { computed, ref, type HTMLAttributes } from "vue";
	import { File, FileImage, FileText, UploadCloud, X } from "@lucide/vue";
	import { cn } from "../utils/cn";
	import Progress from "./Progress.vue";

	const props = withDefaults(
		defineProps<{
			accept?: string;
			multiple?: boolean;
			maxFiles?: number;
			maxSize?: number;
			progress?: number;
			disabled?: boolean;
			label?: string;
			class?: HTMLAttributes["class"];
		}>(),
		{
			multiple: false,
			maxFiles: 5,
			maxSize: 10 * 1024 * 1024,
			disabled: false,
			label: "Upload files",
		},
	);

	const files = defineModel<File[]>({ default: () => [] });
	const input = ref<HTMLInputElement | null>(null);
	const dragging = ref(false);
	const errors = ref<string[]>([]);
	const sizeLimit = computed(
		() => `${Math.max(1, Math.round(props.maxSize / (1024 * 1024)))} MB`,
	);

	function matchesAccept(file: File) {
		if (!props.accept) return true;
		return props.accept
			.split(",")
			.map((part) => part.trim().toLowerCase())
			.some((part) =>
				part.startsWith(".")
					? file.name.toLowerCase().endsWith(part)
					: part.endsWith("/*")
						? file.type.startsWith(part.slice(0, -1))
						: file.type.toLowerCase() === part,
			);
	}
	function addFiles(list: FileList | null) {
		if (!list) return;
		errors.value = [];
		const accepted: File[] = [];
		for (const file of Array.from(list)) {
			if (!matchesAccept(file))
				errors.value.push(`${file.name}: unsupported file type`);
			else if (file.size > props.maxSize)
				errors.value.push(`${file.name}: exceeds ${sizeLimit.value}`);
			else accepted.push(file);
		}
		const next = props.multiple
			? [...files.value, ...accepted]
			: accepted.slice(0, 1);
		if (next.length > props.maxFiles)
			errors.value.push(`Choose up to ${props.maxFiles} files`);
		else files.value = next;
		if (input.value) input.value.value = "";
	}
	function removeFile(file: File) {
		files.value = files.value.filter((item) => item !== file);
	}
	function onDrop(event: DragEvent) {
		dragging.value = false;
		addFiles(event.dataTransfer?.files ?? null);
	}
	function formatSize(size: number) {
		return size < 1024 * 1024
			? `${Math.max(1, Math.round(size / 1024))} KB`
			: `${(size / (1024 * 1024)).toFixed(1)} MB`;
	}
	function fileIcon(file: File) {
		return file.type.startsWith("image/")
			? FileImage
			: file.type.includes("text") || file.type === "application/pdf"
				? FileText
				: File;
	}
</script>

<template>
	<div :class="cn('w-full', props.class)">
		<input
			ref="input"
			type="file"
			class="sr-only"
			:accept="accept"
			:multiple="multiple"
			:disabled="disabled"
			:aria-label="label"
			@change="addFiles(($event.target as HTMLInputElement).files)"
		/>
		<button
			type="button"
			:disabled="disabled"
			:aria-label="label"
			class="flex w-full flex-col items-center justify-center rounded-lg border border-dashed px-4 py-6 text-center transition-colors focus-visible:outline-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"
			:class="
				dragging
					? 'border-text-primary bg-bg-muted'
					: 'border-border bg-bg-surface hover:bg-bg-muted'
			"
			@click="input?.click()"
			@dragenter.prevent="dragging = true"
			@dragover.prevent="dragging = true"
			@dragleave.prevent="dragging = false"
			@drop.prevent="onDrop"
		>
			<span
				class="mb-2 flex size-9 items-center justify-center rounded-lg border border-border bg-bg-muted text-text-muted"
				><UploadCloud class="size-4"
			/></span>
			<span class="text-sm font-medium text-text-primary"
				>Drop files here or
				<span class="underline underline-offset-2">browse</span></span
			>
			<span class="mt-1 text-xs text-text-faint"
				>{{ accept || "Any file type" }} · up to {{ sizeLimit }} each{{
					multiple ? ` · ${maxFiles} files max` : ""
				}}</span
			>
		</button>
		<ul
			v-if="files.length"
			class="mt-2 flex flex-col gap-1.5"
			aria-label="Selected files"
		>
			<li
				v-for="file in files"
				:key="`${file.name}-${file.size}-${file.lastModified}`"
				class="flex min-w-0 items-center gap-2 rounded-md border border-border bg-bg-surface px-2.5 py-2"
			>
				<component
					:is="fileIcon(file)"
					class="size-4 shrink-0 text-text-faint"
				/>
				<span class="min-w-0 flex-1 truncate text-xs text-text-primary"
					>{{ file.name
					}}<span class="ml-1.5 text-text-faint">{{
						formatSize(file.size)
					}}</span></span
				>
				<button
					type="button"
					:aria-label="`Remove ${file.name}`"
					class="flex size-6 shrink-0 items-center justify-center rounded text-text-faint hover:bg-bg-muted hover:text-text-primary"
					@click="removeFile(file)"
				>
					<X class="size-3.5" />
				</button>
			</li>
		</ul>
		<Progress
			v-if="progress !== undefined && files.length"
			class="mt-2"
			:label="progress >= 100 ? 'Upload complete' : 'Uploading files'"
			:value="progress"
			show-value
			color="var(--color-inverse)"
		/>
		<ul
			v-if="errors.length"
			class="mt-2 space-y-1 text-xs text-red-400"
			role="alert"
		>
			<li v-for="error in errors" :key="error">{{ error }}</li>
		</ul>
	</div>
</template>
