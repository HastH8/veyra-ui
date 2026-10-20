---
name: veyra-ui
description: Build, adapt, and debug Vue 3 interfaces with @vezironi/veyra-ui while preserving its compact token-based design. Use for component selection, implementation, theming, and visual consistency in web applications and embedded interfaces.
---

# Veyra UI

Veyra UI is a Vue 3 component package with a compact dark and light theme. This skill guides component choice, package use, and design consistency. The consuming app owns application state, routing, game bridges, permissions, and server communication; package components render state and emit user intent.

## Work sequence

1. **Inspect the host app.** Read its package manifest, Vue entry point, existing design tokens, component conventions, and any existing data or event bridge. Preserve its framework and integration shape.
2. **Check what is installed.** Read the installed package version and inspect `src/index.ts` in the package or the package export list. Match the real installed API rather than guessing from a newer README.
3. **Choose the smallest fitting component set.** If the Veyra UI MCP server is available, call `list_components` with the user task or platform. Then call `get_component_reference` for API notes and `get_component_source` when exact prop types or implementation behavior matter. Fetch only the relevant detailed guide with `get_veyra_ui_reference`.
4. **Compose first.** Prefer package components and their slots over recreating controls. Keep game logic, formatting that depends on game rules, and state transitions in the host app.
5. **Finish the interaction.** Wire `v-model` and events to real state, include loading/empty/disabled/error states where the flow needs them, and preserve keyboard and focus behavior.
6. **Check the visual result.** Run the host app's existing development command and inspect the screen at its actual viewport, including compact embedded layouts when relevant. Correct overflow, clipping, alignment, contrast, and focus issues before finishing.

## Install and import

```sh
npm install @vezironi/veyra-ui
```

Import the package stylesheet once from the app entry point, before app-level overrides:

```ts
import "@vezironi/veyra-ui/style.css";
```

Import components by their public names:

```vue
<script setup lang="ts">
import { Button, Inputs, Progress, ShopItem } from "@vezironi/veyra-ui";
</script>
```

The library targets Vue 3.5+. Its built package includes its icon implementation; apps using built package exports do not need to install the internal icon dependency. Raw source returned by MCP may import package-local helpers or `@lucide/vue`; when copying source, inspect the complete dependency output and either install/replace those imports or prefer the package export.

## Preserve the visual system

- Keep the established compact scale: tight but readable spacing, small rounded corners, subtle one-pixel borders, and clear text hierarchy.
- Use the shipped components for buttons, badges, progress, overlays, and feedback. Use existing tokens for any surrounding layout.
- Core Tailwind color utilities map to the package CSS variables: `bg-bg-base`, `bg-bg-surface`, `bg-bg-muted`, `bg-bg-elevated`, `border-border`, `text-text-primary`, `text-text-muted`, `text-text-faint`, `ring-ring`, `bg-inverse`, `bg-bg-inset`, and the semantic `success`, `danger`, `warning`, and `info` colors (for example `text-danger` or `bg-success/10`).
- The matching CSS variables include `--color-bg-base`, `--color-bg-surface`, `--color-bg-muted`, `--color-bg-muted-hover`, `--color-bg-muted-active`, `--color-bg-elevated`, `--color-border`, `--color-text-primary`, `--color-text-muted`, `--color-text-faint`, `--color-ring`, `--color-inverse`, `--color-text-inverse`, `--color-bg-inset`, `--color-success`, `--color-danger`, `--color-warning`, and `--color-info`. Read the package stylesheet through `get_package_design_tokens` before changing theme-related CSS.
- Dark is the default. The package supports `data-theme="light"` and `useTheme`; follow the host app's theme control rather than adding a second theme state.
- Use the package's existing accent/inverse token consistently. Introduce a new accent only when the host product already defines one and it can be applied as a coherent token.
- Use icons at a consistent size and align them with labels. The design uses icons as supporting cues, not as decoration in every row.
- Make touch and mouse targets usable at the real display size. Keyboard focus must remain visible, and color or animation alone must not carry important state.
- Preserve the host app's layout and design decisions. Matching Veyra means using its component language and tokens, not replacing the entire screen with a package demo.

### Tailwind and scoped CSS

Veyra's stylesheet includes Tailwind v4-generated utilities and the theme tokens. A consuming app does not need to use `@apply` to style the package. In Vue scoped styles or CSS modules, use ordinary CSS declarations with package variables, or add Tailwind's `@reference` in the exact context Tailwind requires before using `@apply`. Avoid adding utility classes to CSS with `@apply` unless the Tailwind theme context is available; that can fail with “unknown utility class” errors.

## Component selection

Use these patterns to narrow the choice; the package export list and component source are authoritative for the installed version.

- **Inputs and selection:** `Inputs`, `Textarea`, `Checkbox`, `Switch`, `RadioGroup`, `SelectMenu`, `MultiSelectMenu`, `Combobox`, `Slider`, `ColorPicker`, `DatePicker`.
- **Actions and navigation:** `Button`, `Toggle`, `DropdownMenu`, `CommandPalette`, `Breadcrumbs`, `Pagination`, `Tabs`.
- **Overlays:** `Popover` for an anchored small panel, `Modal` for a centered decision or focused task, `Drawer` for a side workflow. Use one overlay for one task and keep its close path clear.
- **Feedback and loading:** `Alert` for persistent inline status, `Toast` for brief confirmation, `Progress` for known or unknown work, `Skeleton` for a pending layout, `Spinner` for a small local wait, `EmptyState` for a collection with no records, `Tooltip` for brief supplementary help.
- **Structured content:** `Card`, `Accordion`, `DataTable`, `Avatar`, `Badge`, `StatCard`, `Separator`, `Kbd`, `Calendar`.
- **Task-oriented interfaces:** `InteractionPrompt` for one action, `TargetList` for choosing an item from nearby options, `ShopItem` for an offer and quantity, and `ObjectiveTracker` for a mission or checklist.

For the purpose and main API of every component, call `get_veyra_ui_reference` with `component-catalog`, or use the `list_components` and `get_component_reference` MCP tools.

## Vue state and event boundaries

Use a ref or parent model for values that need to survive rerenders or be shared across components. Keep display data serializable and normalized at the app boundary. Avoid making a package component responsible for API requests, game natives, inventory rules, permissions, or persistence.

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Inputs, Progress, Switch } from "@vezironi/veyra-ui";

const playerName = ref("");
const notificationsEnabled = ref(true);
const uploadProgress = ref(0);
</script>

<template>
  <label class="grid gap-1 text-sm text-text-muted">Character name <Inputs v-model="playerName" placeholder="Enter a name" /></label>
  <Switch v-model="notificationsEnabled" label="Notifications" />
  <Progress :value="uploadProgress" show-value />
</template>
```

Confirm exact prop names and event payloads against the installed component version. Vue kebab-case template props correspond to camelCase script props, but emitted payloads still need to match the component's declared type.

## MCP usage

The package's `veyra-ui-mcp` executable is a read-only stdio server. It helps an assistant discover components, inspect exact source, and retrieve focused design or integration guides.

Recommended tool sequence:

1. `list_components({ query: "shop" })` or the platform/task name to find likely components.
2. `get_component_reference({ name: "ShopItem" })` for use case, props, model behavior, and events.
3. `get_component_source({ name: "ShopItem" })` to read its actual implementation. Set `includeLocalDependencies: true` only when adapting source into another project.
4. `get_veyra_ui_reference({ topic: "ui-integration" })` for application bridge patterns, or `component-recipes` for composition examples.
5. `get_package_design_tokens({})` before extending or overriding the theme.

Treat package source as the final authority if a reference summary and source disagree. The MCP source tool only exposes public component files and their local source dependencies; it does not provide runtime game data or call external services.

## Application integration

Use the detailed `ui-integration` reference when connecting a Vue screen to an API, desktop host, embedded interface, or other application layer. The application owns authoritative state and validation; Vue owns presentation and user interaction; an adapter translates serializable state and user intent between them.

Examples of task-oriented components:

```vue
<InteractionPrompt
  label="Search the wagon"
  description="Hold to inspect its cargo"
  key-label="E"
  :hold-duration="900"
  @interact="requestWagonSearch"
/>

<ShopItem
  v-model="quantity"
  name="Canned beans"
  description="A filling trail meal"
  :price="4"
  currency="$"
  :stock="12"
  @confirm="purchaseItem"
/>

<ObjectiveTracker v-model="activeObjective" title="Supply run" :objectives="objectives" />
<TargetList v-model="selectedTarget" :items="nearbyTargets" :max-distance="5" @select="selectTarget" />
```

`InteractionPrompt` shows its key hint by default. Its `keyboardEnabled` prop defaults to false; turn it on only when the Vue interface owns that key input. If the host application handles controls, keep the component as a visual prompt and let the host decide when to send the action.

Treat UI state as user input, not authority. The API or application layer must re-check prices, stock, capacity, permissions, item existence, and workflow status when an action is requested. A filtered or disabled row improves presentation; it does not validate the request.

## Completion checklist

- Imports resolve from the installed package version and its stylesheet is loaded once.
- Each displayed value has an intentional owner and each action reaches a real parent handler.
- Loading, empty, disabled, and error states fit the actual screen when those states can occur.
- The screen uses package tokens, preserves the host theme, and remains readable at its actual viewport.
- Actions with business or access rules are validated by the owning application or service, not trusted from UI props or event payloads.
