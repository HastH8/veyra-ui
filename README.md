# @vezironi/veyra-ui

A Vue 3 UI component kit built with Tailwind CSS v4. It ships with dark and light themes.

## Installation

```bash
npm install @vezironi/veyra-ui
# or
pnpm add @vezironi/veyra-ui
```

Requires `vue` **3.5 or newer** as a peer dependency.

## Usage

Import the stylesheet once, in your app entry (for example `main.ts`):

```ts
import "@vezironi/veyra-ui/style.css";
```

Then use the components:

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Button, Inputs, ThemeToggle } from "@vezironi/veyra-ui";

const name = ref("");
</script>

<template>
  <Inputs v-model="name" type="text" />
  <Button variant="primary" size="md">Save</Button>
  <ThemeToggle />
</template>
```

Every component accepts a `class` prop. Its classes are merged with the component's own classes through `tailwind-merge`, so your classes win when they conflict.

## Components

Accordion, Alert, Avatar, Badge, Breadcrumbs, Button, Calendar, Card, Checkbox, Combobox, CommandPalette, ColorPicker, DataTable, DatePicker, Drawer, DropdownMenu, EmptyState, FileUpload, Inputs, InteractionPrompt, Kbd, Modal, MultiSelectMenu, ObjectiveTracker, Pagination, Popover, Progress, RadioGroup, SelectMenu, Separator, ShopItem, Skeleton, Slider, Spinner, StatCard, Switch, Tabs, TargetList, Textarea, ThemeToggle, Toast, Toggle, Tooltip

### Component highlights

- **Navigation and actions:** Breadcrumbs with collapsed paths, DropdownMenu, searchable CommandPalette, and compact pagination.
- **Forms and selection:** searchable Combobox, multi-select, DatePicker, and a redesigned ColorPicker with hex/RGB/HSL and opacity controls.
- **Content and overlays:** sortable/selectable DataTable, drag-and-drop FileUpload, anchored Popover, side Drawer, Modal, and Toast feedback.
- **Progress and controls:** determinate, striped, colored, and indeterminate Progress states, plus a Switch with a full-travel thumb.
- **Task workflows:** InteractionPrompt with optional hold progress, ShopItem with stock and quantity totals, ObjectiveTracker with completion state, and TargetList with optional distance filtering.

The additions use the existing theme tokens, support `class` customization, and are shown in the local gallery. Exact props and emitted events are available from the component source and MCP reference tools.

## Local component gallery

Run `npm run dev` to open the interactive component gallery. It shows the components with live controls, so you can preview states such as color values, progress, toggles, and form inputs while developing.

The color picker supports hex, RGB, and HSL output formats, plus opacity. The progress bar accepts custom colors and indeterminate or striped states:

```vue
<script setup lang="ts">
import { ref } from "vue";
import { ColorPicker, Progress } from "@vezironi/veyra-ui";

const accent = ref("#8b5cf6");
const upload = ref(64);
</script>

<template>
  <ColorPicker v-model="accent" label="Accent color" :presets="['#8b5cf6', '#06b6d4']" />
  <Progress :value="upload" :color="accent" size="lg" striped show-value />
  <Progress indeterminate label="Loading" />
</template>
```

The gallery also includes examples for `DataTable`, `FileUpload`, `Combobox`, `CommandPalette`, `DropdownMenu`, `Popover`, `Drawer`, `Toast`, and the game UI components `InteractionPrompt`, `ShopItem`, `ObjectiveTracker`, and `TargetList`.

## FiveM and RedM components

These components are framework-agnostic Vue UI. Keep FiveM/RedM natives, NUI callbacks, network events, and server validation in your resource's app or adapter code. Pass serializable game state into the components and translate emitted UI intent into NUI callbacks.

```vue
<InteractionPrompt
  label="Search the wagon"
  description="Hold to inspect its cargo"
  key-label="E"
  :hold-duration="900"
  @interact="searchWagon"
/>

<ShopItem
  v-model="quantity"
  name="Canned beans"
  :price="4"
  currency="$"
  :stock="12"
  @confirm="purchaseItem"
/>

<ObjectiveTracker v-model="activeObjective" :objectives="objectives" />
<TargetList v-model="targetId" :items="nearbyTargets" :max-distance="5" />
```

`InteractionPrompt` shows the key by default; set `keyboard-enabled` only if the NUI owns key input. Never trust displayed prices, inventory, permissions, or target IDs as authoritative game state; validate those in the game/server layer.

## MCP server for coding assistants

The package includes a read-only stdio MCP server. It exposes the public component catalog with categories and use cases, detailed API notes for selected components, component source (optionally with local dependencies), the main agent skill and focused integration guides, and the canonical theme stylesheet. It requires Node.js 20 or newer.

Claude Code:

```sh
claude mcp add --scope user veyra-ui -- npx -y --package @vezironi/veyra-ui veyra-ui-mcp
```

Codex:

```sh
codex mcp add veyra-ui -- npx -y --package @vezironi/veyra-ui veyra-ui-mcp
```

Other MCP clients can use a stdio server entry:

```json
{
  "mcpServers": {
    "veyra-ui": {
      "command": "npx",
      "args": ["-y", "--package", "@vezironi/veyra-ui", "veyra-ui-mcp"]
    }
  }
}
```

Available tools:

- `list_components`: search public exports by name, category, platform, and use case.
- `get_component_reference`: get use guidance, props, `v-model` behavior, and events for task-oriented and general components.
- `get_component_source`: read the exact public Vue source; optionally include its local source dependencies.
- `get_veyra_ui_skill`: read the main agent workflow and package design rules.
- `get_veyra_ui_reference`: fetch a focused `ui-integration`, `component-recipes`, or `component-catalog` guide.
- `get_package_design_tokens`: read the canonical theme stylesheet and token definitions.

The main agent skill and its detailed references are shipped in `skills/veyra-ui/`. Copy the directory into your project's agent skill directory to make its guidance available in coding sessions. MCP-connected agents can fetch the same material on demand.

## Theming

Dark is the default theme. To switch to light, set `data-theme="light"` on `<html>`. You can also use the `useTheme` composable, which is what `ThemeToggle` uses:

```ts
import { useTheme } from "@vezironi/veyra-ui";

const { theme, toggleTheme } = useTheme(); // theme: Ref<"dark" | "light">
```

`useTheme` saves the choice to `localStorage` under the `veyra-theme` key. When nothing is saved, it falls back to the system preference (`prefers-color-scheme`). It is SSR-safe: it only reads browser APIs on the client.

Colors are defined as CSS variables. Override them to customize the theme:

```css
:root {
  --color-bg-base: #0b0b0f;
}

[data-theme="light"] {
  --color-bg-base: #fafafa;
}
```

Tokens: `--color-bg-base`, `--color-bg-surface`, `--color-bg-muted`, `--color-bg-muted-hover`, `--color-bg-muted-active`, `--color-bg-elevated`, `--color-border`, `--color-text-primary`, `--color-text-muted`, `--color-text-faint`, `--color-ring`, `--color-inverse`, `--color-text-inverse`, `--color-bg-inset`, `--color-success`, `--color-danger`, `--color-warning`, `--color-info`.

## Notes on the stylesheet

`style.css` contains the Tailwind base reset (preflight), the theme tokens, and the utility classes the components use. It also sets the page background and text color on `body`. All of this lives in cascade layers (`@layer base` and `@layer utilities`), so any unlayered CSS in your app takes precedence.

## License

MIT
