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

Accordion, Alert, Avatar, Badge, Button, Calendar, Card, Checkbox, DatePicker, Inputs, Kbd, Modal, MultiSelectMenu, Pagination, Progress, RadioGroup, SelectMenu, Skeleton, Slider, Spinner, StatCard, Switch, Tabs, Textarea, ThemeToggle, Toggle, Tooltip

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

Tokens: `--color-bg-base`, `--color-bg-surface`, `--color-bg-muted`, `--color-bg-muted-hover`, `--color-bg-muted-active`, `--color-bg-elevated`, `--color-border`, `--color-text-primary`, `--color-text-muted`, `--color-text-faint`, `--color-ring`, `--color-inverse`, `--color-text-inverse`.

## Notes on the stylesheet

`style.css` contains the Tailwind base reset (preflight), the theme tokens, and the utility classes the components use. It also sets the page background and text color on `body`. All of this lives in cascade layers (`@layer base` and `@layer utilities`), so any unlayered CSS in your app takes precedence.

## License

MIT
