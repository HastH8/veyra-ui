# Veyra UI composition recipes

These examples show how to combine package components while keeping the app's business state in Vue. Check the installed package source for exact APIs when the package version differs.

## Searchable inventory or admin list

Use `Inputs` for a separate search field, `DataTable` for structured rows, `Badge` for status, and `EmptyState` when filtering returns no rows. Use `Pagination` when the data is paged by the host application. Keep sorting, filtering, and pagination ownership consistent: either the table receives the current page or the table owns the displayed local rows, not both.

```vue
<label class="grid gap-1 text-sm text-text-muted">
  Search inventory
  <Inputs v-model="query" placeholder="Name or item ID" />
</label>
<DataTable v-if="visibleRows.length" :columns="columns" :rows="visibleRows" />
<EmptyState v-else title="No items found" description="Try a different search." />
```

Inspect `DataTable.vue` for the exact column/row shape and event API before wiring it.

## Create or edit form

Use `Inputs`, `Textarea`, `SelectMenu`/`Combobox`, `Checkbox`/`Switch`, `Alert`, and `Button` to build a focused form. Keep validation errors near the relevant field when possible. Disable repeat submission while saving, show a useful pending label/state, and preserve values on a recoverable failure.

## Confirm a destructive or costly action

Use `Modal` for a focused decision. State the consequence in the title/body, show the specific item or amount, and provide explicit cancel and confirm actions. Keep the server callback as the final authority. Use `Toast` for success and `Alert` for an error that should persist.

## Contextual quick edit

Use `Popover` when the panel is small and directly related to a control (for example, edit a filter or choose a small option set). Use `Drawer` when the user needs a larger detail panel or multiple related fields. Keep the anchor or opener visible and provide a clear close path.

## Upload flow

Use `FileUpload` for selection, drag/drop, and client-side file validation. Pair it with `Progress` if the host upload API reports a percentage, `Alert` for a persistent rejection, and `Toast` for a brief success. Validate file type, size, access, and destination on the receiving service as well.

## App-level theme and layout

1. Import `@vezironi/veyra-ui/style.css` once in the application entry.
2. Keep the app shell responsible for page width, header/navigation, and content layout.
3. Use package components inside the shell; let them own their component-level states.
4. Use package CSS variables for custom CSS. Keep overrides after the package stylesheet and scope them to the app or a specific surface.
5. Set `data-theme="light"` on `<html>` or use `useTheme`/`ThemeToggle` when the app needs the light theme.

```css
.resource-panel {
  color: var(--color-text-primary);
  background: var(--color-bg-surface);
  border: 1px solid var(--color-border);
}
```

## Visual review

Review at the actual host viewport, including narrow and embedded layouts. Check for clipped popovers, dialogs wider than the viewport, long labels pushing actions away, missing empty/loading/error states, and loss of focus visibility. The local gallery in the repository is a preview harness; `src/App.vue` is not a package component export.
