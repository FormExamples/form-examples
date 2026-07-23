# ToolBarButton

A single `<button type="button">` designed to be placed inside a `ToolBar`, with an optional `disabled` state and full attribute pass-through.

## What it is

`ToolBarButton` is a headless Svelte 5 component rendering a native `<button type="button">` optimized for use inside a `ToolBar` container that provides roving-focus keyboard navigation.

## What it does

- Renders `<button class="tool-bar-button {className}" type="button" {disabled}>`.
- Renders the `children` snippet as the button's content.
- Spreads additional HTML attributes onto the `<button>` (including event handlers).

## When to use it

- As each action button inside a `ToolBar` (bold, italic, undo, redo, etc.).
- When you want implicit button semantics with toolbar-compatible focus behavior.
- When an action should not submit a parent form.

## When not to use it

- Don't use it outside a `ToolBar` when you want roving focus — the navigation logic lives in the parent.
- Don't use it to submit forms — use `SubmitInput` or `ButtonInput`.
- Don't use it for a toggle state — use `ToggleButton` with `role="switch"`.
- Don't use it for navigation — use an `<a>` element.

## How to use it

Import and place inside a `ToolBar`. Provide content via `children` and wire `onclick` via rest-props.

## Props

- `class` — string, optional. Extra CSS class appended to `tool-bar-button`.
- `disabled` — boolean, default `false`. Whether the button is disabled.
- `children` — Snippet, required. Button content.
- `...restProps` — any additional HTML attributes spread onto the `<button>`.

## Usage

```svelte
<script lang="ts">
  import ToolBar from "../ToolBar/ToolBar.svelte";
  import ToolBarButton from "./ToolBarButton.svelte";
</script>

<ToolBar label="Editor tools">
  <ToolBarButton>Bold</ToolBarButton>
  <ToolBarButton>Italic</ToolBarButton>
  <ToolBarButton>Underline</ToolBarButton>
</ToolBar>
```

```svelte
<script lang="ts">
  import ToolBar from "../ToolBar/ToolBar.svelte";
  import ToolBarButton from "./ToolBarButton.svelte";

  let canRedo = $state(false);
</script>

<ToolBar label="History">
  <ToolBarButton>Undo</ToolBarButton>
  <ToolBarButton disabled={!canRedo}>Redo</ToolBarButton>
</ToolBar>
```

```svelte
<script lang="ts">
  import ToolBar from "../ToolBar/ToolBar.svelte";
  import ToolBarButton from "./ToolBarButton.svelte";

  let count = $state(0);
</script>

<ToolBar label="Counter">
  <ToolBarButton onclick={() => count--}>−</ToolBarButton>
  <ToolBarButton onclick={() => count++}>+</ToolBarButton>
</ToolBar>
<p>Count: {count}</p>
```

```svelte
<script lang="ts">
  import ToolBar from "../ToolBar/ToolBar.svelte";
  import ToolBarButton from "./ToolBarButton.svelte";
</script>

<ToolBar label="Outils">
  <ToolBarButton aria-label="Annuler">↶</ToolBarButton>
  <ToolBarButton aria-label="Refaire">↷</ToolBarButton>
</ToolBar>
```

## Accessibility

- Implicit `button` role from the native `<button>`.
- `type="button"` prevents accidental form submission.
- `disabled` removes the button from the tab sequence and is conveyed to assistive technology.
- Arrow-key navigation is provided by the parent `ToolBar`, not by this component.

## Related components

- `ToolBar` — the required parent container that supplies arrow-key roving focus.
- `TaskBarButton` — a simpler bar button without roving focus.
- `MenuBarButton` — button inside a menu bar.
- `Button` — a general-purpose button for standalone contexts.

---

Lily™ and Lily Design System™ are trademarks.
