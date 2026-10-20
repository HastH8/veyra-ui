# Component catalog by job

Use `list_components` to search this catalog against the installed package's real public exports. Use `get_component_reference` for selected-component API notes and `get_component_source` for exact definitions.

## Task-oriented interfaces

| Need | Component | Use it for | State / events |
| --- | --- | --- | --- |
| Present one action | `InteractionPrompt` | Key hint, action title, optional description, click action, or hold-to-complete interaction | Props drive the display; emits `interact` after activation. `keyboardEnabled` defaults to false. |
| Choose from nearby options | `TargetList` | People, objects, service options, or other targets with optional distance | `v-model` holds selected ID; `select` emits the full selected item. Optional `maxDistance` filters rows. |
| Select an offer quantity | `ShopItem` | Item name, unit price, stock, quantity, total, and buy/sell action | `v-model` holds clamped quantity; `confirm` emits `{ quantity, total }`. |
| Show a checklist | `ObjectiveTracker` | Multi-step workflow, delivery, task, or mission progress | `objectives` carries rows; `v-model` stores the active objective ID. Progress derives from each row's `completed` flag. |

## Forms and value entry

- `Inputs`: single-line text, number, and other supported input types. Check the source for supported type names and label/error props.
- `Textarea`: multi-line input; use for notes, descriptions, or longer messages.
- `Checkbox`: a boolean option with label/description support.
- `Switch`: a two-state setting where the on/off state should be immediately apparent, such as notifications or a feature toggle.
- `RadioGroup`: choose exactly one option from a small visible set.
- `SelectMenu`: choose one from a native-style select menu.
- `Combobox`: search and choose one from a longer list.
- `MultiSelectMenu`: search and choose several values.
- `Slider`: adjust a value on a bounded numeric range.
- `ColorPicker`: choose a color, enter a color value, or adjust supported color/opacity controls.
- `DatePicker` and `Calendar`: enter a date or browse dates directly.

## Actions and navigation

- `Button`: primary, secondary, and other supported action treatments. Keep the most important action visually clear.
- `Toggle`: a pressed/unpressed action control.
- `DropdownMenu`: a short contextual action list, including separators, shortcut labels, and disabled entries.
- `CommandPalette`: keyboard-searchable commands for global navigation and actions.
- `Breadcrumbs`: show the current path through nested sections.
- `Pagination`: move through a multi-page collection.
- `Tabs`: switch between related views at the same hierarchy level.

## Overlays and contextual help

- `Popover`: a small anchored panel tied to a nearby control. Use for brief settings or contextual details.
- `Modal`: a centered, focused task or decision. Use a clear title, primary action, and close/cancel path.
- `Drawer`: a side panel for a related detail view or a longer secondary workflow.
- `Tooltip`: short supporting information on hover/focus. Keep essential instructions visible without requiring a tooltip.
- `Kbd`: display a keyboard key or shortcut within interface text.

## Feedback, loading, and content

- `Alert`: persistent inline status or feedback.
- `Toast`: transient confirmation, status, or action feedback.
- `Progress`: known percentage, striped progress, custom color, or indeterminate work. Keep its label meaningful.
- `Spinner`: a small localized wait indicator.
- `Skeleton`: reserve the shape of content that is loading.
- `EmptyState`: explain why a collection is empty and give a useful next action when one exists.
- `Badge`: short status, category, or count.
- `Avatar`: person or character identity with fallback support.
- `StatCard`: compact metric.
- `Card`: group related content and actions on a surface.
- `Accordion`: disclose optional grouped information.
- `Separator`: divide related sections without adding another card.

## Package foundations and theme

- `ThemeToggle` and `useTheme`: switch/read the package's dark or light theme state.
- `Button`, `Card`, `Separator`, `Skeleton`, `Spinner`, and `StatCard` form common layout primitives.
- Components accept a `class` prop merged with the component classes. Use it for local sizing/layout adjustments while retaining the Veyra tokens and interaction states.

## Choosing between similar components

- Use `Combobox` for one selected value; use `MultiSelectMenu` when several values can remain selected.
- Use `SelectMenu` for a concise native-style choice; use `Combobox` when searching matters.
- Use `Popover` for a small anchored panel, `Modal` for a centered decision, and `Drawer` for a side workflow.
- Use `Toast` for temporary feedback and `Alert` for a message that should remain in the content.
- Use `Spinner` for a small local wait, `Skeleton` when the content layout is known, and `Progress` when work progress can be shown.
- Use `InteractionPrompt` for one action. Use `TargetList` when choosing one item among nearby entities.
- Use `ObjectiveTracker` for steps and completion. Use `Progress` for a standalone process or upload.

The source for the installed package version determines exact prop names, defaults, slots, and events.
