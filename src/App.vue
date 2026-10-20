<script setup lang="ts">
import { ref } from "vue";
import {
    Accordion,
    Alert,
    Avatar,
    Badge,
    Breadcrumbs,
    Button,
    Calendar,
    Card,
    Checkbox,
    Combobox,
    CommandPalette,
    ColorPicker,
    DataTable,
    DatePicker,
    Drawer,
    DropdownMenu,
    EmptyState,
    FileUpload,
    Inputs,
    InteractionPrompt,
    Kbd,
    Modal,
    ObjectiveTracker,
    MultiSelectMenu,
    Pagination,
    Popover,
    Progress,
    RadioGroup,
    SelectMenu,
    Separator,
    ShopItem,
    Skeleton,
    Slider,
    Spinner,
    StatCard,
    Switch,
    Tabs,
    TargetList,
    Textarea,
    ThemeToggle,
    Toast,
    Toggle,
    Tooltip,
} from "./index";

const accent = ref("#8b5cf6");
const progress = ref(64);
const checked = ref(true);
const switched = ref(false);
const toggled = ref(true);
const page = ref(3);
const calendarDate = ref<Date | null>(new Date());
const pickerDate = ref<Date | null>(null);
const selectedRadio = ref("monthly");
const selectedPlan = ref("pro");
const selectedTags = ref(["vue", "design"]);
const activeTab = ref("preview");
const modalOpen = ref(false);
const drawerOpen = ref(false);
const commandOpen = ref(false);
const toastOpen = ref(false);
const name = ref("Veyra");
const notes = ref("A small, themeable component kit for Vue.");
const framework = ref("vue");
const uploadedFiles = ref<File[]>([]);
const selectedRows = ref<Array<string | number>>([]);
const tableLoading = ref(false);
const userSort = ref<{ key: string; direction: "asc" | "desc" } | null>(null);
const lastCommand = ref("None selected");
const shopQuantity = ref(1);
const activeObjective = ref("visit");
const selectedTarget = ref<string | number | null>(null);
const lastGameAction = ref("No action yet");

const accordionItems = [
    { title: "Can I customize the theme?", value: "theme", content: "Yes. Override the CSS variables or set data-theme on the document." },
    { title: "Can components be controlled?", value: "controlled", content: "Components with v-model support controlled state from your application." },
];
const plans = [
    { label: "Starter", value: "starter" },
    { label: "Pro", value: "pro" },
    { label: "Team", value: "team" },
];
const tagOptions = [
    { label: "Vue", value: "vue" },
    { label: "Design", value: "design" },
    { label: "Accessibility", value: "accessibility" },
];
const tabs = [
    { label: "Preview", value: "preview" },
    { label: "Details", value: "details" },
];
const frameworks = [
    { label: "Vue 3", value: "vue", description: "Progressive JavaScript framework" },
    { label: "React", value: "react", description: "Component-based UI library" },
    { label: "Svelte", value: "svelte", description: "Compiler-based UI framework" },
    { label: "Solid", value: "solid", description: "Fine-grained reactive UI" },
];
const commandItems = [
    { label: "Open settings", value: "settings", group: "Navigation", shortcut: "⌘ ," },
    { label: "Create a project", value: "create", group: "Projects", keywords: ["new"] },
    { label: "Toggle theme", value: "theme", group: "Appearance", keywords: ["dark", "light"] },
];
const tableColumns = [
    { key: "name", label: "Name", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "role", label: "Role" },
];
const tableRows = [
    { id: "1", name: "Avery Johnson", status: "Active", role: "Designer" },
    { id: "2", name: "Jordan Lee", status: "Invited", role: "Developer" },
    { id: "3", name: "Morgan Chen", status: "Active", role: "Admin" },
];
const objectives = [
    { id: "visit", label: "Visit the general store", description: "Head to Valentine", distance: 240, completed: false },
    { id: "supplies", label: "Collect supplies", description: "Purchase food and water", distance: 520, completed: false },
    { id: "return", label: "Return to camp", distance: "—", completed: true },
];
const nearbyTargets = [
    { id: "stable", label: "Valentine Stable", description: "Manage owned horses", category: "Stable", distance: 12 },
    { id: "clerk", label: "General Store Clerk", description: "Browse provisions", category: "Shop", distance: 4 },
    { id: "wagon", label: "Delivery Wagon", description: "Registered vehicle", category: "Vehicle", distance: 28 },
];
const menuItems = [
    { label: "Edit profile", value: "edit", shortcut: "⌘ E" },
    { label: "Duplicate", value: "duplicate" },
    { type: "separator" as const },
    { label: "Delete project", value: "delete", destructive: true },
];
</script>

<template>
    <main class="min-h-screen bg-bg-base px-5 py-10 text-text-primary sm:px-8">
        <div class="mx-auto max-w-6xl">
            <header class="mb-10 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-text-faint">@vezironi/veyra-ui</p>
                    <h1 class="text-3xl font-semibold tracking-tight">Component gallery</h1>
                    <p class="mt-2 max-w-xl text-sm text-text-muted">Interactive previews for the package components. Change the controls to explore their states.</p>
                </div>
                <ThemeToggle />
            </header>

            <div class="columns-1 gap-4 sm:columns-2 lg:columns-3">
                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Accordion</h2>
                    <Accordion :items="accordionItems" />
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Alert</h2>
                    <div class="flex flex-col gap-3">
                        <Alert title="Everything is up to date" description="Your changes have been saved." variant="success" />
                        <Alert title="Check this setting" description="Some details may need your attention." variant="danger" />
                    </div>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Avatar</h2>
                    <div class="flex items-center gap-3">
                        <Avatar fallback="VA" size="sm" />
                        <Avatar fallback="UI" badge />
                        <Avatar fallback="UX" size="lg" badge badge-variant="busy" />
                    </div>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Badge</h2>
                    <div class="flex flex-wrap gap-2">
                        <Badge>Default</Badge><Badge variant="success" dot>Ready</Badge>
                        <Badge variant="muted">Draft</Badge><Badge variant="danger">Action needed</Badge>
                    </div>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Breadcrumbs</h2>
                    <Breadcrumbs :items="[{ label: 'Home', href: '#' }, { label: 'Workspace', href: '#' }, { label: 'Projects', href: '#' }, { label: 'Components', href: '#' }, { label: 'Breadcrumbs' }]" :max-visible="3" />
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Button</h2>
                    <div class="flex flex-wrap items-center gap-2">
                        <Button size="sm">Small</Button><Button>Save changes</Button>
                        <Button variant="secondary" size="lg">Cancel</Button>
                    </div>
                    <div class="flex flex-wrap items-center gap-2">
                        <Button variant="solid">Solid</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="danger">Delete</Button>
                        <Button variant="success">Approve</Button>
                        <Button variant="warning">Warning</Button>
                        <Button variant="danger" disabled>Disabled</Button>
                    </div>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Calendar</h2>
                    <Calendar v-model="calendarDate" class="mx-auto" />
                    <p class="mt-3 text-xs text-text-faint">Selected: {{ calendarDate?.toLocaleDateString() ?? "none" }}</p>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Card</h2>
                    <Card title="Design system" description="A flexible foundation for your next project." value="12 components" value-label="Included">
                        <p>Composable, themeable, and ready to use.</p>
                        <template #footer><Button size="sm">Explore</Button></template>
                    </Card>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Checkbox</h2>
                    <Checkbox v-model="checked" label="Include updates in the changelog" />
                    <p class="mt-2 text-xs text-text-faint">Checked: {{ checked }}</p>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Combobox</h2>
                    <Combobox v-model="framework" :options="frameworks" label="Framework" placeholder="Choose a framework" />
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">CommandPalette</h2>
                    <Button variant="secondary" @click="commandOpen = true">Open command palette <Kbd>⌘ K</Kbd></Button>
                    <p class="text-xs text-text-faint">Last action: {{ lastCommand }}</p>
                    <CommandPalette v-model:open="commandOpen" :items="commandItems" @select="lastCommand = $event" />
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">ColorPicker</h2>
                    <ColorPicker v-model="accent" label="Accent color" :presets="['#8b5cf6', '#06b6d4', '#f97316', '#22c55e', '#ef4444']" />
                    <ColorPicker v-model="accent" label="Accent color (simple)" :detailed="false" />
                    <p class="mt-3 text-xs text-text-muted">Linked preview</p>
                    <Progress :value="progress" :color="accent" size="lg" />
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">DatePicker</h2>
                    <DatePicker v-model="pickerDate" class="max-w-xs" />
                    <p class="mt-2 text-xs text-text-faint">{{ pickerDate?.toLocaleDateString() ?? "Choose a date" }}</p>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <div class="flex items-center justify-between gap-2"><h2 class="text-sm font-semibold text-text-primary">DataTable</h2><Button variant="secondary" size="sm" @click="tableLoading = !tableLoading">{{ tableLoading ? "Show rows" : "Show loading" }}</Button></div>
                    <DataTable v-model="selectedRows" v-model:sort="userSort" :columns="tableColumns" :rows="tableRows" :loading="tableLoading" :page-size="2" selectable>
                        <template #cell="{ column, value }">
                            <Badge v-if="column.key === 'status'" :variant="value === 'Active' ? 'success' : 'muted'">{{ value }}</Badge>
                            <template v-else>{{ value }}</template>
                        </template>
                        <template #footer>{{ selectedRows.length }} selected · 3 team members</template>
                    </DataTable>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Drawer</h2>
                    <Button @click="drawerOpen = true">Open settings panel</Button>
                    <Drawer v-model="drawerOpen" title="Project settings" description="Manage your workspace preferences." side="right">
                        <label class="flex flex-col gap-2 text-sm text-text-muted">Project name <Inputs v-model="name" /></label>
                        <template #footer><Button variant="secondary" size="sm" @click="drawerOpen = false">Cancel</Button><Button size="sm" @click="drawerOpen = false">Save changes</Button></template>
                    </Drawer>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">DropdownMenu</h2>
                    <DropdownMenu :items="menuItems" label="Project actions" @select="lastCommand = $event" />
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">EmptyState</h2>
                    <EmptyState title="No projects yet" description="Create your first project to get started.">
                        <Button size="sm">Create project</Button>
                    </EmptyState>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">FileUpload</h2>
                    <FileUpload v-model="uploadedFiles" accept="image/*,.pdf" multiple :max-files="3" :progress="38" />
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Inputs</h2>
                    <label class="flex flex-col gap-1.5 text-xs text-text-muted">Project name
                        <Inputs v-model="name" placeholder="Project name" />
                    </label>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">InteractionPrompt</h2>
                    <InteractionPrompt label="Search the wagon" description="Hold to inspect its cargo" key-label="E" :hold-duration="900" @interact="lastGameAction = 'Wagon inspected'" />
                    <p class="text-xs text-text-faint">{{ lastGameAction }}</p>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">ObjectiveTracker</h2>
                    <ObjectiveTracker v-model="activeObjective" title="Supply run" :objectives="objectives" />
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">ShopItem</h2>
                    <ShopItem v-model="shopQuantity" name="Canned beans" description="A filling trail meal" :price="4" currency="$" :stock="12" @confirm="lastGameAction = `Bought ${$event.quantity} for $${$event.total}`" />
                    <p class="text-xs text-text-faint">{{ lastGameAction }}</p>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">TargetList</h2>
                    <TargetList v-model="selectedTarget" :items="nearbyTargets" :max-distance="100" @select="lastGameAction = `Target: ${$event.label}`" />
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Kbd</h2>
                    <div class="flex items-center gap-2 text-sm text-text-muted">
                        Press <Kbd>⌘</Kbd><span>+</span><Kbd>K</Kbd> to open search
                    </div>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Modal</h2>
                    <Button @click="modalOpen = true">Open dialog</Button>
                    <Modal v-if="modalOpen" title="Preview dialog" @close="modalOpen = false">
                        <p class="px-5 py-4 text-sm text-text-muted">This is a live preview of the modal component.</p>
                        <template #footer><Button variant="secondary" size="sm" @click="modalOpen = false">Close</Button></template>
                    </Modal>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">MultiSelectMenu</h2>
                    <MultiSelectMenu v-model="selectedTags" :options="tagOptions" label="Topics" />
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Pagination</h2>
                    <Pagination v-model="page" :total="8" />
                    <p class="mt-2 text-xs text-text-faint">Page {{ page }} of 8</p>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Popover</h2>
                    <Popover align="start">
                        <template #trigger="{ triggerProps }"><Button v-bind="triggerProps" variant="secondary">Open popover</Button></template>
                        <div class="w-52"><p class="text-sm font-medium text-text-primary">Quick details</p><p class="mt-1 text-xs text-text-muted">Popover content stays anchored to its trigger.</p></div>
                    </Popover>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Progress</h2>
                    <label class="flex flex-col gap-3 text-xs text-text-muted">Progress: {{ progress }}%
                        <Slider v-model="progress" :show-value="false" />
                    </label>
                    <Progress :value="progress" :color="accent" label="Upload progress" show-value size="lg" striped />
                    <Progress indeterminate label="Loading" class="mt-3" />
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">RadioGroup</h2>
                    <RadioGroup v-model="selectedRadio" label="Billing cycle" orientation="horizontal" :options="[{ label: 'Monthly', value: 'monthly' }, { label: 'Yearly', value: 'yearly' } ]" />
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">SelectMenu</h2>
                    <SelectMenu v-model="selectedPlan" :options="plans" label="Plan" />
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Separator</h2>
                    <div class="flex items-center gap-3 text-sm text-text-muted">
                        <span>Overview</span><Separator orientation="vertical" class="h-5" /><span>Settings</span>
                    </div>
                    <Separator class="my-4" />
                    <p class="text-xs text-text-faint">Horizontal and vertical separators</p>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Skeleton</h2>
                    <div class="flex items-center gap-3">
                        <Skeleton circle class="size-10" />
                        <div class="flex flex-1 flex-col gap-2"><Skeleton class="h-3 w-3/4" /><Skeleton class="h-3 w-1/2" /></div>
                    </div>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Slider</h2>
                    <Slider v-model="progress" label="Adjust value" show-value />
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Spinner</h2>
                    <div class="flex items-center gap-5 text-text-muted">
                        <Spinner variant="ring" /><Spinner variant="dual" /><Spinner variant="arc" />
                        <Spinner variant="lines" /><Spinner variant="dashed" />
                    </div>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">StatCard</h2>
                    <StatCard label="Active users" value="2,480" color="#22c55e" />
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Switch</h2>
                    <Switch v-model="switched" label="Enable notifications" />
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Tabs</h2>
                    <Tabs v-model="activeTab" :tabs="tabs">
                        <template #preview><p class="text-sm text-text-muted">The component is ready to use.</p></template>
                        <template #details><p class="text-sm text-text-muted">Vue 3 · Tailwind CSS v4</p></template>
                    </Tabs>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Toast</h2>
                    <Button variant="secondary" @click="toastOpen = true">Show notification</Button>
                    <Toast v-model:open="toastOpen" title="Changes saved" description="Your project settings were updated." variant="success" />
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Textarea</h2>
                    <Textarea v-model="notes" :maxlength="140" :rows="3" :max-rows="5" />
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">ThemeToggle</h2>
                    <div class="flex items-center gap-3"><ThemeToggle /><span class="text-sm text-text-muted">Switch light and dark themes</span></div>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Toggle</h2>
                    <Toggle v-model="toggled">{{ toggled ? "Pinned" : "Pin" }}</Toggle>
                </section>

                <section class="mb-4 flex w-full break-inside-avoid flex-col gap-y-3 rounded-xl border border-border bg-bg-surface p-4">
                    <h2 class="text-sm font-semibold text-text-primary">Tooltip</h2>
                    <Tooltip content="A helpful hint"><Button variant="secondary">Hover or focus me</Button></Tooltip>
                </section>
            </div>
            <footer class="mt-10 border-t border-border pt-5 text-xs text-text-faint">Edit a component under <code>src/components</code> and this gallery updates with hot reload.</footer>
        </div>
    </main>
</template>

