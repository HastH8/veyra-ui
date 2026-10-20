#!/usr/bin/env node
import { readFile, stat } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = join(packageRoot, "src");
const exportFile = join(sourceRoot, "index.ts");
const guideFile = join(packageRoot, "skills", "veyra-ui", "SKILL.md");
const packageManifest = JSON.parse(await readFile(join(packageRoot, "package.json"), "utf8"));

const descriptions = {
	Accordion: "Expandable disclosure sections for grouped content.",
	Alert: "Inline status and feedback messages for success, warnings, and errors.",
	Avatar: "User or character avatar with fallback initials and status indicator.",
	Badge: "Compact status, category, or count label.",
	Breadcrumbs: "Navigation trail with collapsed middle items.",
	Button: "Theme-aware action button with primary, secondary, solid, outline, danger, success, and warning variants.",
	Calendar: "Month calendar for selecting a date.",
	Card: "Surface container with optional header, content, and footer slots.",
	Checkbox: "Accessible boolean checkbox with label and description support.",
	Combobox: "Searchable single-selection option picker.",
	CommandPalette: "Keyboard searchable command dialog with groups and shortcuts.",
	ColorPicker: "Compact color picker with hex, RGB, HSL, and opacity controls.",
	DataTable: "Sortable, selectable table with loading and pagination states.",
	DatePicker: "Date input paired with a calendar popover.",
	Drawer: "Side panel dialog for settings and detail views.",
	DropdownMenu: "Accessible action menu with separators, shortcuts, and disabled items.",
	EmptyState: "Empty collection placeholder with message and optional action.",
	FileUpload: "File picker with drag and drop, validation, and upload progress.",
	Inputs: "Theme-aware single-line text, number, and form input.",
	InteractionPrompt: "Game interaction prompt with key hint and optional hold progress.",
	Kbd: "Inline keyboard keycap for shortcuts and interaction hints.",
	Modal: "Centered dialog for focused forms, decisions, and confirmations.",
	MultiSelectMenu: "Searchable multi-value select menu.",
	ObjectiveTracker: "Quest or job objective list with completion and distance.",
	Pagination: "Page navigation with compact ellipsis for long result sets.",
	Popover: "Anchored floating panel for contextual controls and details.",
	Progress: "Determinate, striped, colored, or indeterminate progress bar.",
	RadioGroup: "Mutually exclusive option selection with horizontal or vertical layout.",
	SelectMenu: "Native select-style option menu with Veyra theme styling.",
	Separator: "Horizontal or vertical visual divider.",
	ShopItem: "Shop item card with stock, quantity selector, total, and buy or sell action.",
	Skeleton: "Animated placeholder for loading content.",
	Slider: "Accessible range input with optional label and value.",
	Spinner: "Small loading indicator with multiple animation styles.",
	StatCard: "Compact metric card with label, value, and optional accent.",
	Switch: "Accessible two-state toggle switch.",
	Tabs: "Tabbed navigation with controlled active panel.",
	TargetList: "Nearby players, entities, or interactions with distance and selection.",
	Textarea: "Resizable multi-line input with optional character counter.",
	ThemeToggle: "Control for switching between the package dark and light themes.",
	Toast: "Transient status notification with close and action support.",
	Toggle: "Single pressed or unpressed action control.",
	Tooltip: "Small descriptive popup shown on hover or focus.",
};
const gameComponents = new Set([
	"InteractionPrompt",
	"ObjectiveTracker",
	"ShopItem",
	"TargetList",
]);

const componentGroups = {
	Foundations: ["Button", "Card", "Separator", "Skeleton", "Spinner", "StatCard"],
	Forms: ["Checkbox", "ColorPicker", "Combobox", "DatePicker", "Inputs", "MultiSelectMenu", "RadioGroup", "SelectMenu", "Slider", "Switch", "Textarea", "Toggle"],
	Navigation: ["Breadcrumbs", "CommandPalette", "DropdownMenu", "Pagination", "Tabs"],
	Feedback: ["Alert", "Badge", "EmptyState", "Progress", "Toast", "Tooltip"],
	Overlays: ["Drawer", "Modal", "Popover"],
	Data: ["Accordion", "Avatar", "Calendar", "DataTable", "FileUpload", "Kbd"],
	GameUI: ["InteractionPrompt", "ObjectiveTracker", "ShopItem", "TargetList"],
	Theming: ["ThemeToggle"],
};

const componentUseCases = {
	InteractionPrompt: ["world interaction", "hold-to-interact action", "key hint", "search or inspect action"],
	ObjectiveTracker: ["missions", "quests", "delivery routes", "job tasks", "completion progress"],
	ShopItem: ["shops", "inventory purchase", "sell menu", "quantity and total preview"],
	TargetList: ["nearby players", "entities", "interaction targets", "distance-filtered selection"],
	FileUpload: ["document upload", "image upload", "drag and drop", "client-side file validation"],
	DataTable: ["admin tables", "inventory lists", "sortable records", "selectable rows"],
	CommandPalette: ["global search", "keyboard command menu", "admin actions"],
	Combobox: ["searchable single choice", "large option lists", "entity selection"],
	ColorPicker: ["theme settings", "vehicle or clothing color", "hex and opacity editing"],
	Popover: ["anchored contextual controls", "small detail panels", "quick settings"],
	Drawer: ["mobile detail panel", "settings panel", "secondary workflow"],
};

const componentGuides = {
	InteractionPrompt: {
		whenToUse: "A single action with a visible key hint. Use holdDuration for deliberate actions such as confirming, inspecting, or reviewing. Use a separate list when the user must choose among several options.",
		props: {
			label: "Required action title.", description: "Optional one-line context.", keyLabel: "Displayed key hint; defaults to E.",
			holdDuration: "Hold duration in milliseconds. Zero or omitted activates on click.", keyboardEnabled: "Listen for the keyLabel on window; defaults to false. Enable only when this NUI owns keyboard input.", disabled: "Prevents activation and cancels an in-progress hold.",
		},
		events: { interact: "Emitted once after a click or completed hold. The component does not call an API or external callback." },
		model: "No v-model.",
	},
	ShopItem: {
		whenToUse: "A single buy or sell offer with quantity controls, current stock, and a total preview. Keep authoritative price, stock, balance, and transaction checks in the game server.",
		props: { name: "Required item name.", description: "Optional item detail.", price: "Unit price, clamped to a non-negative finite value for display.", currency: "Currency prefix; defaults to $.", stock: "Optional maximum quantity; unavailable stock disables confirmation.", mode: "buy or sell; defaults to buy.", actionLabel: "Optional custom action button label.", disabled: "Disables quantity changes and confirmation." },
		events: { "update:modelValue": "Quantity changes; initial quantity defaults to 1.", confirm: "Emits { quantity, total } after a valid user confirmation." },
		model: "v-model is an integer quantity clamped from 1 through stock (or 99 when stock is omitted).",
	},
	ObjectiveTracker: {
		whenToUse: "A compact mission, job, or quest checklist with selected objective, optional distance labels, and completion percentage.",
		props: { title: "Optional heading; defaults to Objectives.", objectives: "Required array of { id, label, description?, distance?, completed? }.", showDistance: "Show distance values; defaults to true." },
		events: { "update:modelValue": "Active objective ID changes when an objective row is selected." },
		model: "v-model is the active objective ID or null. Completion is derived from each item's completed flag.",
	},
	TargetList: {
		whenToUse: "A list of nearby entities or players when the user must select one target. Use maxDistance to filter entries client-side for presentation; validate target existence and permission in the game layer.",
		props: { title: "Optional heading; defaults to Nearby targets.", emptyText: "Empty-list message.", maxDistance: "Optional maximum distance in the same unit used by item.distance.", items: "Required array of { id, label, description?, distance?, category?, disabled? }." },
		events: { "update:modelValue": "Selected target ID changes.", select: "Emits the complete selected TargetOption." },
		model: "v-model is the selected string, number, or null target ID.",
	},
};

function componentGroup(name) {
	return Object.entries(componentGroups).find(([, names]) => names.includes(name))?.[0] ?? "Other";
}

async function getComponents() {
	const source = await readFile(exportFile, "utf8");
	const matches = Array.from(
		source.matchAll(/export \{ default as (\w+) \} from "\.\/components\/([^\"]+)\.vue";/g),
	);
	return matches.map(([, name, file]) => ({
		name,
		file: `src/components/${file}.vue`,
		description: descriptions[name] ?? `${name} Vue component from Veyra UI.`,
		group: componentGroup(name),
		tags: [...(gameComponents.has(name) ? ["game", "nui", "fivem", "redm"] : []), ...(componentUseCases[name] ?? [])],
		useCases: componentUseCases[name] ?? [],
	}));
}

async function readSafeSource(path) {
	const absolutePath = resolve(sourceRoot, path);
	if (absolutePath !== sourceRoot && !absolutePath.startsWith(`${sourceRoot}${sep}`)) {
		throw new Error("Requested source path is outside the package source directory.");
	}
	return readFile(absolutePath, "utf8");
}

async function collectLocalDependencies(file, collected = new Map()) {
	const absoluteFile = resolve(packageRoot, file);
	if (collected.has(absoluteFile)) return collected;
	const source = await readFile(absoluteFile, "utf8");
	collected.set(absoluteFile, source);
	for (const [, specifier] of source.matchAll(/from\s+["'](\.{1,2}\/[^"']+)["']/g)) {
		const base = resolve(dirname(absoluteFile), specifier);
		const candidates = [base, `${base}.vue`, `${base}.ts`, `${base}.css`, join(base, "index.ts")];
		let dependency;
		for (const candidate of candidates) {
			try {
				const candidateStat = await stat(candidate);
				if (candidateStat.isFile()) {
					dependency = candidate;
					break;
				}
			} catch {
				// Try the next supported local source extension.
			}
		}
		if (!dependency) continue;
		const sourceRelative = relative(sourceRoot, dependency);
		if (sourceRelative.startsWith(`..${sep}`) || sourceRelative === "..") continue;
		await collectLocalDependencies(dependency, collected);
	}
	return collected;
}

function textResult(text) {
	return { content: [{ type: "text", text }] };
}

function createServer() {
	const server = new McpServer({ name: "veyra-ui", version: packageManifest.version });

	server.registerTool(
		"list_components",
		{
			title: "List Veyra UI components",
			description: "Search the package's actual public exports. Returns each matching component's source path, category, concise purpose, relevant tags, and common use cases. Search terms can be component names, categories (Forms, GameUI, Overlays), platform names (FiveM, RedM), or interface tasks such as shop, objective, target, upload, and search. Call this first when selecting a component; call get_component_reference for its API and integration behavior, then get_component_source when implementation details are needed.",
			inputSchema: z.object({
				query: z.string().optional().describe("Optional case-insensitive substring search across name, description, category, tags, and use cases. Omit to return the complete catalog."),
			}),
		},
		async ({ query }) => {
			const components = await getComponents();
			const normalizedQuery = query?.trim().toLowerCase();
			const filtered = normalizedQuery
				? components.filter((item) => `${item.name} ${item.description} ${item.group} ${item.tags.join(" ")} ${item.useCases.join(" ")}`.toLowerCase().includes(normalizedQuery))
				: components;
			return textResult(JSON.stringify(filtered, null, 2));
		},
	);

	server.registerTool(
		"get_component_reference",
		{
			title: "Get Veyra UI component API guide",
			description: "Get component-specific selection guidance, props, model behavior, and emitted events. Includes precise API notes for task-oriented prompt, offer, checklist, and target components. For any API detail not listed here, inspect the exact source with get_component_source; source is authoritative.",
			inputSchema: z.object({
				name: z.string().describe("Public component export name, for example ShopItem or DatePicker."),
			}),
		},
		async ({ name }) => {
			const component = (await getComponents()).find((item) => item.name.toLowerCase() === name.trim().toLowerCase());
			if (!component) return { ...textResult(`Unknown component: ${name}. Call list_components to find public component names.`), isError: true };
			const guide = componentGuides[component.name];
			return textResult(JSON.stringify({
				...component,
				whenToUse: guide?.whenToUse ?? `Use ${component.name} for ${component.description.toLowerCase()}`,
				props: guide?.props ?? "Use get_component_source for the exact prop definitions and defaults.",
				model: guide?.model ?? "Use get_component_source to check whether this component supports v-model.",
				events: guide?.events ?? "Use get_component_source for the exact emitted event names and payloads.",
				sourceNextStep: "Call get_component_source with this component name. Set includeLocalDependencies=true when copying raw source into a different app.",
			}, null, 2));
		},
	);

	server.registerTool(
		"get_component_source",
		{
			title: "Get Veyra UI component source",
			description: "Return the full source code for one public component. Set includeLocalDependencies to include local Vue/TypeScript helpers it imports.",
			inputSchema: z.object({
				name: z.string().describe("Public component name, for example InteractionPrompt."),
				includeLocalDependencies: z.boolean().optional().describe("Include local helper source files (default false)."),
			}),
		},
		async ({ name, includeLocalDependencies }) => {
			const component = (await getComponents()).find((item) => item.name.toLowerCase() === name.trim().toLowerCase());
			if (!component) {
				return { ...textResult(`Unknown component: ${name}. Call list_components to see available names.`), isError: true };
			}
			if (!includeLocalDependencies) {
				return textResult(`// ${component.file}\n${await readSafeSource(relative(sourceRoot, join(packageRoot, component.file)))}`);
			}
			const files = await collectLocalDependencies(component.file);
			const entries = [...files].sort(([left], [right]) => left.localeCompare(right));
			return textResult(entries.map(([path, content]) => `// ${relative(packageRoot, path)}\n${content}`).join("\n\n"));
		},
	);

	server.registerTool(
		"get_veyra_ui_skill",
		{
			title: "Get Veyra UI design and usage skill",
			description: "Return the main agent skill: installation, design rules, workflow, and integration boundaries. For focused detail, use get_veyra_ui_reference with topic ui-integration, component-recipes, or component-catalog.",
			inputSchema: z.object({}),
		},
		async () => textResult(await readFile(guideFile, "utf8")),
	);

	server.registerTool(
		"get_veyra_ui_reference",
		{
			title: "Get detailed Veyra UI integration reference",
			description: "Fetch an on-demand detailed guide shipped with the package. Use ui-integration for data flow, application event/API patterns, and validation boundaries; component-recipes for common screen composition; component-catalog for component selection by task. Read only the topic needed for the current task.",
			inputSchema: z.object({
				topic: z.enum(["ui-integration", "component-recipes", "component-catalog"]).describe("The focused reference guide to retrieve."),
			}),
		},
		async ({ topic }) => textResult(await readFile(join(packageRoot, "skills", "veyra-ui", "references", `${topic}.md`), "utf8")),
	);

	server.registerTool(
		"get_package_design_tokens",
		{
			title: "Get Veyra UI design tokens",
			description: "Return the canonical package theme stylesheet, including dark/light CSS tokens and Tailwind v4 utility definitions. Read this before adding package-matching CSS or theme overrides; preserve the existing token system.",
			inputSchema: z.object({}),
		},
		async () => textResult(await readSafeSource("style.css")),
	);

	return server;
}

serveStdio(createServer, { onerror: (error) => console.error("Veyra UI MCP error:", error) });
