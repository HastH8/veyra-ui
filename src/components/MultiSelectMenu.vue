
<script setup lang="ts">
import {
    computed,
    nextTick,
    onBeforeUnmount,
    ref,
    watch,
    type HTMLAttributes,
} from "vue";
import { Check, ChevronDown } from "@lucide/vue";
import { cn } from "../utils/cn";

interface SelectOption {
    label: string;
    value: string;
    color?: string;
}

const props = withDefaults(
    defineProps<{
        options: SelectOption[];
        label?: string;
        hint?: string;
        size?: "sm" | "md" | "lg";
        disabled?: boolean;
        placeholder?: string;
        maxVisible?: number;
        class?: HTMLAttributes["class"];
    }>(),
    {
        size: "md",
        disabled: false,
        placeholder: "Select options",
        maxVisible: 2,
    },
);

const modelValue = defineModel<string[]>({ default: () => [] });

const rootRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLButtonElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const open = ref(false);

const menuStyle = ref<Record<string, string>>({});

const selectedOptions = computed(() =>
    props.options.filter((option) => modelValue.value.includes(option.value)),
);

const visibleOptions = computed(() =>
    selectedOptions.value.slice(0, props.maxVisible),
);

const hiddenCount = computed(
    () => selectedOptions.value.length - visibleOptions.value.length,
);

const sizes = {
    sm: {
        root: "gap-y-1",
        label: "text-[11px]",
        hint: "text-[10px]",
        trigger: "min-h-8 px-2.5 py-1.5 text-xs",
        option: "px-2.5 py-1.5 text-xs",
        chevron: "size-3.5",
        chip: "px-1 py-px text-[10px]",
        box: "size-3",
        check: "size-2",
    },
    md: {
        root: "gap-y-1.5",
        label: "text-sm",
        hint: "text-xs",
        trigger: "min-h-9 px-3 py-2 text-sm",
        option: "px-3 py-2 text-sm",
        chevron: "size-4",
        chip: "px-1.5 py-0.5 text-xs",
        box: "size-3.5",
        check: "size-2.5",
    },
    lg: {
        root: "gap-y-2",
        label: "text-base",
        hint: "text-sm",
        trigger: "min-h-11 px-4 py-2.5 text-base",
        option: "px-4 py-2.5 text-base",
        chevron: "size-5",
        chip: "px-2 py-0.5 text-sm",
        box: "size-4",
        check: "size-3",
    },
};

function updateMenuPosition() {
    const trigger = triggerRef.value;

    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const gap = 4;
    const viewportPadding = 8;
    const availableBelow = window.innerHeight - rect.bottom - gap - viewportPadding;
    const availableAbove = rect.top - gap - viewportPadding;
    const maxHeight = Math.max(
        80,
        Math.min(
            240,
            availableBelow >= 120 || availableBelow >= availableAbove
                ? availableBelow
                : availableAbove,
        ),
    );

    const placeAbove =
        availableBelow < Math.min(240, 120) &&
        availableAbove > availableBelow;

    const width = Math.min(rect.width, window.innerWidth - viewportPadding);
    const left = Math.max(
        viewportPadding,
        Math.min(rect.left, window.innerWidth - width - viewportPadding),
    );

    menuStyle.value = {
        position: "fixed",
        left: `${left}px`,
        width: `${width}px`,
        maxHeight: `${maxHeight}px`,
        overflowY: "auto",
        top: placeAbove
            ? `${Math.max(viewportPadding, rect.top - maxHeight - gap)}px`
            : `${rect.bottom + gap}px`,
    };
}

async function toggleOpen() {
    if (props.disabled) return;

    if (open.value) {
        closeMenu();
        return;
    }

    open.value = true;
    await nextTick();
    updateMenuPosition();
}

function closeMenu() {
    open.value = false;
}

async function toggleOption(value: string) {
    modelValue.value = modelValue.value.includes(value)
        ? modelValue.value.filter((item) => item !== value)
        : [...modelValue.value, value];

    await nextTick();
    updateMenuPosition();
}

function handleOutsideClick(event: PointerEvent) {
    const target = event.target;

    if (!(target instanceof Node)) return;

    if (
        !rootRef.value?.contains(target) &&
        !menuRef.value?.contains(target)
    ) {
        closeMenu();
    }
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape" && open.value) {
        closeMenu();
        triggerRef.value?.focus();
    }
}

function handlePositionChange() {
    if (open.value) updateMenuPosition();
}

watch(open, (isOpen) => {
    if (isOpen) {
        document.addEventListener("pointerdown", handleOutsideClick);
        document.addEventListener("keydown", handleKeydown);
        window.addEventListener("resize", handlePositionChange);
        window.addEventListener("scroll", handlePositionChange, true);
    } else {
        document.removeEventListener("pointerdown", handleOutsideClick);
        document.removeEventListener("keydown", handleKeydown);
        window.removeEventListener("resize", handlePositionChange);
        window.removeEventListener("scroll", handlePositionChange, true);
    }
});

onBeforeUnmount(() => {
    document.removeEventListener("pointerdown", handleOutsideClick);
    document.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("resize", handlePositionChange);
    window.removeEventListener("scroll", handlePositionChange, true);
});
</script>

<template>
    <div
        ref="rootRef"
        :class="cn('relative flex flex-col', sizes[size].root, props.class)"
    >
        <label
            v-if="label"
            class="font-medium text-text-muted"
            :class="sizes[size].label"
        >
            {{ label }}
        </label>

        <p
            v-if="hint"
            class="text-text-faint"
            :class="sizes[size].hint"
        >
            {{ hint }}
        </p>

        <div class="relative">
            <button
                ref="triggerRef"
                type="button"
                class="flex w-full items-center justify-between gap-2 rounded-md border border-border transition-colors"
                :class="[
                    sizes[size].trigger,
                    disabled
                        ? 'cursor-not-allowed! bg-bg-surface/60 text-text-faint'
                        : 'cursor-pointer bg-bg-surface text-text-primary hover:bg-bg-muted focus-visible:border-inverse/25',
                ]"
                :disabled="disabled"
                :aria-expanded="open"
                aria-haspopup="listbox"
                @click="toggleOpen"
            >
                <span class="flex min-w-0 items-center gap-1 truncate text-left">
                    <span
                        v-if="selectedOptions.length === 0"
                        class="truncate text-text-faint"
                    >
                        {{ placeholder }}
                    </span>

                    <span
                        v-for="option in visibleOptions"
                        :key="option.value"
                        class="flex min-w-0 items-center gap-x-1.5 rounded border border-border bg-bg-muted"
                        :class="sizes[size].chip"
                    >
                        <span
                            v-if="option.color"
                            class="size-1.5 shrink-0 rounded-full"
                            :style="{ background: option.color }"
                        />
                        <span class="truncate">{{ option.label }}</span>
                    </span>

                    <span
                        v-if="hiddenCount > 0"
                        class="shrink-0 text-xs text-text-faint"
                    >
                        +{{ hiddenCount }}
                    </span>
                </span>

                <ChevronDown
                    class="shrink-0 text-text-faint transition-transform"
                    :class="[sizes[size].chevron, { 'rotate-180': open }]"
                />
            </button>

            <Teleport to="body">
                <div
                    v-if="open"
                    ref="menuRef"
                    class="fixed z-[9999] overflow-y-auto rounded-md border border-border bg-bg-base shadow-2xl"
                    :style="menuStyle"
                    role="listbox"
                    aria-multiselectable="true"
                >
                    <button
                        v-for="option in options"
                        :key="option.value"
                        type="button"
                        role="option"
                        :aria-selected="modelValue.includes(option.value)"
                        class="w-full cursor-pointer text-left text-text-primary transition-colors hover:bg-bg-muted"
                        :class="sizes[size].option"
                        @click="toggleOption(option.value)"
                    >
                        <span class="flex items-center gap-x-2">
                            <span
                                class="flex shrink-0 items-center justify-center rounded border transition-colors"
                                :class="[
                                    sizes[size].box,
                                    modelValue.includes(option.value)
                                        ? 'border-inverse bg-inverse text-text-inverse'
                                        : 'border-border bg-bg-surface',
                                ]"
                            >
                                <Check
                                    v-if="modelValue.includes(option.value)"
                                    :class="sizes[size].check"
                                    :stroke-width="3"
                                />
                            </span>
                            <span
                                v-if="option.color"
                                class="size-1.5 shrink-0 rounded-full"
                                :style="{ background: option.color }"
                            />
                            <span>{{ option.label }}</span>
                        </span>
                    </button>

                    <div
                        v-if="options.length === 0"
                        class="text-text-faint"
                        :class="sizes[size].option"
                    >
                        No options available
                    </div>
                </div>
            </Teleport>
        </div>
    </div>
</template>
