# Application integration patterns

This guide connects Veyra UI components to an application's existing data flow. It applies to browser apps, embedded interfaces, admin panels, and other Vue hosts.

## Responsibility boundary

| Layer | Owns |
| --- | --- |
| API or domain service | Authoritative records, prices, permissions, workflow rules, persistence, and final operation results |
| Host application | Routing, shared state, fetching, session state, integrations with external systems, and choosing when a screen is open |
| Adapter or bridge | Translating external payloads into serializable Vue data and translating UI events into application requests |
| Vue screen | Rendering state, collecting user input, local interaction state, and showing pending/success/error feedback |
| Veyra components | Reusable visual and interaction patterns; no business authority or service access |

Keep the host application's framework and integration conventions. The examples use placeholder adapter functions; replace them with the project's actual API client, event bus, or bridge.

## State flow

1. The host application loads or receives state through its existing data flow.
2. The adapter normalizes it into plain, serializable values for Vue.
3. Vue stores shared values in refs/reactive state and passes them to components as props or `v-model`.
4. A component emits a narrow user intent such as `interact`, `confirm`, or `select`.
5. The app handles the event and sends a narrow request through its existing API or bridge.
6. The service validates the request, performs the operation, and returns a success or error result.
7. The app updates the screen from the result or the next authoritative state refresh.

Prefer strings, finite numbers, booleans, arrays, and plain objects at the component boundary. Convert dates, class instances, framework-specific models, and complex external values into explicit display fields. Use stable IDs as Vue keys.

## Component patterns

### A single action

```vue
<InteractionPrompt
  label="Review application"
  description="Hold to confirm the details"
  key-label="E"
  :hold-duration="900"
  @interact="requestReview"
/>
```

```ts
function requestReview() {
  return applicationApi.review({ applicationId: currentId.value });
}
```

The key hint is visual by default. `keyboardEnabled` defaults to false; enable it only when this interface owns that keyboard input. A hold interaction resets when released, canceled, blurred, disabled, or unmounted.

### An offer with quantity

```vue
<ShopItem
  v-model="quantity"
  :name="offer.label"
  :description="offer.description"
  :price="offer.unitPrice"
  :currency="offer.currency"
  :stock="offer.available"
  @confirm="({ quantity, total }) => submitOrder(offer.id, quantity, total)"
/>
```

The displayed total is a preview. The service should calculate the final total from authoritative data and accepted quantity. Treat the emitted ID, quantity, and total as a request, then refresh the offer and show the operation result. Use `mode="sell"` when the flow represents a sell offer.

### A multi-step checklist

```ts
type ChecklistItem = {
  id: string;
  label: string;
  description?: string;
  distance?: number | string;
  completed?: boolean;
};

const items = ref<ChecklistItem[]>([]);
const activeItem = ref<string | null>(null);
```

```vue
<ObjectiveTracker v-model="activeItem" title="Onboarding" :objectives="items" />
```

Completion percentage is derived from `completed`. Update it from the owning workflow state; selecting an item does not mark it complete.

### A list of selectable targets

```ts
type Option = {
  id: string;
  label: string;
  description?: string;
  category?: string;
  distance?: number;
  disabled?: boolean;
};

const options = ref<Option[]>([]);
const selected = ref<string | number | null>(null);
```

```vue
<TargetList
  v-model="selected"
  :items="options"
  :max-distance="5"
  @select="option => openDetails(option.id)"
/>
```

The component can filter by distance and disable a row for presentation. Re-check that the selected record still exists and that the operation is allowed when the app handles the event.

## Pending, error, and stale states

- Track pending operations in the host app and prevent duplicate submissions.
- Show progress when the service can provide a meaningful percentage; use a spinner or skeleton for an unknown wait.
- Use an `Alert` for a persistent rejection and a `Toast` for brief confirmation.
- Refresh or replace stale display values from the operation result or next authoritative state update.
- Handle navigation, session changes, deleted records, and timeouts so open panels do not keep presenting invalid actions.

## Validation

UI constraints make controls easier to use; validate in the owning service or application before committing state. Re-check prices, capacity, access rules, record existence, workflow status, duplicate requests, and operation limits. Send stable IDs and the user's requested action instead of treating an entire UI object as trusted input. Return an explicit result so the UI can reflect success or explain failure.
