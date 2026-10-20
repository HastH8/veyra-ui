<script setup lang="ts">
	import { computed, watch, type HTMLAttributes } from "vue";
	import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ArrowUpDown } from "@lucide/vue";
	import { cn } from "../utils/cn";
	import Checkbox from "./Checkbox.vue";
	import Skeleton from "./Skeleton.vue";

	export interface DataTableColumn {
		key: string;
		label: string;
		sortable?: boolean;
		align?: "left" | "center" | "right";
	}
	export type DataTableRow = Record<
		string,
		string | number | boolean | null | undefined
	>;

	const props = withDefaults(
		defineProps<{
			columns: DataTableColumn[];
			rows: DataTableRow[];
			rowKey?: string;
			selectable?: boolean;
			emptyText?: string;
			loading?: boolean;
			loadingRows?: number;
			pageSize?: number;
			class?: HTMLAttributes["class"];
		}>(),
		{
			rowKey: "id",
			selectable: false,
			emptyText: "No results",
			loading: false,
			loadingRows: 4,
		},
	);

	const selected = defineModel<Array<string | number>>({ default: () => [] });
	const sort = defineModel<{ key: string; direction: "asc" | "desc" } | null>(
		"sort",
		{ default: null },
	);
	const page = defineModel<number>("page", { default: 1 });
	const sortedRows = computed(() => {
		if (!sort.value) return props.rows;
		const { key, direction } = sort.value;
		return [...props.rows].sort((a, b) => {
			const left = a[key];
			const right = b[key];
			const order =
				typeof left === "number" && typeof right === "number"
					? left - right
					: String(left ?? "").localeCompare(String(right ?? ""), undefined, {
							numeric: true,
							sensitivity: "base",
						});
			return direction === "asc" ? order : -order;
		});
	});
	const pageCount = computed(() =>
		props.pageSize
			? Math.max(1, Math.ceil(sortedRows.value.length / props.pageSize))
			: 1,
	);
	const visibleRows = computed(() =>
		props.pageSize
			? sortedRows.value.slice(
					(page.value - 1) * props.pageSize,
					page.value * props.pageSize,
				)
			: sortedRows.value,
	);
	const allSelected = computed(
		() =>
			visibleRows.value.length > 0 &&
			visibleRows.value.every((row) =>
				selected.value.includes(row[props.rowKey] as string | number),
			),
	);
	watch(
		() => props.rows.length,
		() => {
			page.value = 1;
		},
	);
	watch(sort, () => {
		page.value = 1;
	});

	function rowId(row: DataTableRow) {
		return row[props.rowKey] as string | number;
	}
	function toggleAll(checked: boolean) {
		const visibleIds = visibleRows.value.map(rowId);
		selected.value = checked
			? [...new Set([...selected.value, ...visibleIds])]
			: selected.value.filter((id) => !visibleIds.includes(id));
	}
	function toggleRow(id: string | number, checked: boolean) {
		selected.value = checked
			? [...selected.value, id]
			: selected.value.filter((value) => value !== id);
	}
	function toggleSort(column: DataTableColumn) {
		if (!column.sortable) return;
		sort.value =
			sort.value?.key === column.key
				? {
						key: column.key,
						direction: sort.value.direction === "asc" ? "desc" : "asc",
					}
				: { key: column.key, direction: "asc" };
	}
	function display(value: DataTableRow[string]) {
		return value == null ? "—" : String(value);
	}
</script>

<template>
	<div
		:class="
			cn('w-full overflow-hidden rounded-lg border border-border', props.class)
		"
	>
		<div class="overflow-x-auto">
			<table class="w-full border-collapse text-left text-sm">
				<thead class="bg-bg-muted/60 text-xs text-text-muted">
					<tr>
						<th v-if="selectable" class="w-10 px-3 py-3">
							<Checkbox
								aria-label="Select all rows"
								:model-value="allSelected"
								:disabled="!visibleRows.length"
								class="relative align-middle"
								@update:model-value="toggleAll"
							/>
						</th>
						<th
							v-for="column in columns"
							:key="column.key"
							scope="col"
							class="whitespace-nowrap px-4 py-3 font-medium"
							:class="{
								'text-center': column.align === 'center',
								'text-right': column.align === 'right',
							}"
						>
							<button
								v-if="column.sortable"
								type="button"
								class="inline-flex items-center gap-1.5 hover:text-text-primary"
								@click="toggleSort(column)"
							>
								{{ column.label
								}}<ArrowUp
									v-if="sort?.key === column.key && sort.direction === 'asc'"
									class="size-3.5"
								/><ArrowDown
									v-else-if="sort?.key === column.key"
									class="size-3.5"
								/><ArrowUpDown v-else class="size-3.5 opacity-50" />
							</button>
							<span v-else>{{ column.label }}</span>
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					<template v-if="loading">
						<tr
							v-for="index in loadingRows"
							:key="`loading-${index}`"
							aria-hidden="true"
							class="border-b border-border"
						>
							<td v-if="selectable" class="px-3 py-3"><Skeleton class="h-4 w-4" /></td>
							<td v-for="column in columns" :key="column.key" class="px-4 py-4">
								<Skeleton class="h-3" :class="index % 2 ? 'w-3/4' : 'w-1/2'" />
							</td>
						</tr>
					</template>
					<tr
						v-else
						v-for="(row, index) in visibleRows"
						:key="String(rowId(row) ?? index)"
						class="text-text-primary transition-colors hover:bg-bg-muted/40"
					>
						<td v-if="selectable" class="px-3 py-3">
							<Checkbox
								:aria-label="`Select row ${index + 1}`"
								:model-value="selected.includes(rowId(row))"
								class="relative align-middle"
								@update:model-value="toggleRow(rowId(row), $event)"
							/>
						</td>
						<td
							v-for="column in columns"
							:key="column.key"
							class="px-4 py-3"
							:class="{
								'text-center': column.align === 'center',
								'text-right': column.align === 'right',
							}"
						>
							<slot
								name="cell"
								:row="row"
								:column="column"
								:value="row[column.key]"
								>{{ display(row[column.key]) }}</slot
							>
						</td>
					</tr>
					<tr v-if="!loading && !rows.length">
						<td
							:colspan="columns.length + (selectable ? 1 : 0)"
							class="px-4 py-10 text-center text-sm text-text-faint"
						>
							<slot name="empty">{{ emptyText }}</slot>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div
			v-if="pageSize && pageCount > 1"
			class="flex items-center justify-between border-t border-border px-3 py-2"
		>
			<span class="text-xs text-text-faint">Page {{ page }} of {{ pageCount }}</span>
			<div class="flex items-center gap-1">
				<button
					type="button"
					aria-label="Previous table page"
					:disabled="page <= 1"
					class="flex size-7 items-center justify-center rounded text-text-muted hover:bg-bg-muted disabled:opacity-40"
					@click="page--"
				><ArrowLeft class="size-3.5" /></button>
				<button
					type="button"
					aria-label="Next table page"
					:disabled="page >= pageCount"
					class="flex size-7 items-center justify-center rounded text-text-muted hover:bg-bg-muted disabled:opacity-40"
					@click="page++"
				><ArrowRight class="size-3.5" /></button>
			</div>
		</div>
		<footer
			v-if="$slots.footer"
			class="border-t border-border bg-bg-surface px-4 py-3 text-xs text-text-muted"
		>
			<slot name="footer" />
		</footer>
	</div>
</template>
