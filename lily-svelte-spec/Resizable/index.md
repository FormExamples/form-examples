# Resizable

A headless resizable container that exposes a focusable landmark region and advertises which directions resizing is allowed via a `data-resize` attribute. Consumers bring their own CSS `resize` and `overflow` rules to produce the visual and interactive resize handle.

## What it is

`Resizable` is a Svelte 5 headless primitive that renders a single `<div>` marked with `role="region"`, `tabindex="0"`, and a `data-resize` data attribute. It provides the semantic and keyboard-reachable structure for an adjustable panel without prescribing any styling or resize implementation.

## What it does

- Renders a `<div class="resizable ...">` wrapper around `children`.
- Applies `role="region"` and `aria-label` to form a named landmark.
- Exposes a `tabindex="0"` so the container can receive keyboard focus.
- Exposes `data-resize="both|horizontal|vertical"` so CSS can target a specific resize axis (for example, `div[data-resize="horizontal"] { resize: horizontal; overflow: auto; }`).
- Spreads any extra attributes onto the root `<div>` via `...restProps`.

The component itself contains no resize logic, no drag handlers, and no styles. Everything visual is the consumer's responsibility.

## When to use it

- Adjustable side panels or preview panes that must be reachable by keyboard users.
- Code editors, diff viewers, or media preview areas where the user should be able to grow or shrink the container.
- Form cells or cards that should honor a user-controlled size for accessibility or layout flexibility.
- Any surface that needs to be announced as a landmark region because of its resizing semantics.

## When not to use it

- Splitting two panels against a shared handle - use `Splitter` (with `role="separator"`) instead.
- Pure scroll containers with no resize requirement - use `ScrollArea` instead.
- Drag-to-reorder or drag-to-move interactions - those are distinct patterns and do not map to `role="region"`.
- Non-interactive decorative regions that should not receive Tab focus.

## How to use it

1. Import the component from its source file.
2. Provide a translated `label` (required) to form the accessible name.
3. Pick a `direction` (`"both"`, `"horizontal"`, or `"vertical"`) - defaults to `"both"`.
4. Pass the content through the `children` snippet.
5. Write consumer CSS targeting the `.resizable` class and `[data-resize="..."]` selector to apply the actual CSS `resize` property.

## Props

- `class` (string, optional, default `""`) - extra class names; merged with the base `resizable` token on the root `<div>`.
- `label` (string, required) - accessible name applied via `aria-label`.
- `direction` (`"both" | "horizontal" | "vertical"`, optional, default `"both"`) - written to `data-resize` for CSS targeting.
- `children` (Snippet, required) - content to render inside the container.
- `...restProps` - any additional HTML attributes spread onto the root `<div>`.

## Usage

Basic both-axis resizable region:

```svelte
<script lang="ts">
    import Resizable from "./Resizable.svelte";
</script>

<Resizable label="Preview panel">
    <p>Drag the bottom-right corner to resize.</p>
</Resizable>
```

Horizontal-only sidebar:

```svelte
<script lang="ts">
    import Resizable from "./Resizable.svelte";
</script>

<Resizable label="Sidebar" direction="horizontal">
    <nav>
        <a href="/">Home</a>
        <a href="/docs">Docs</a>
    </nav>
</Resizable>
```

Vertical-only preview with extra attributes:

```svelte
<script lang="ts">
    import Resizable from "./Resizable.svelte";
</script>

<Resizable label="Output" direction="vertical" id="output-pane">
    <pre>{output}</pre>
</Resizable>
```

Resizable code editor area with consumer styling:

```svelte
<script lang="ts">
    import Resizable from "./Resizable.svelte";
    let code = $state("// write code here");
</script>

<Resizable label="Editor" direction="both" class="editor-shell">
    <textarea bind:value={code}></textarea>
</Resizable>
```

Bound state to persist user size (example pattern - consumer-driven):

```svelte
<script lang="ts">
    import Resizable from "./Resizable.svelte";
    let width = $state(400);
</script>

<Resizable label="Chart" direction="horizontal" style={`width:${width}px`}>
    <div>Chart content</div>
</Resizable>
```

## Accessibility

- `role="region"` marks the container as a named landmark, following the WAI-ARIA Region Role specification.
- `aria-label` provides a required accessible name - supply a localized string.
- `tabindex="0"` ensures keyboard users can focus the container and rely on browser-native scroll/resize affordances.
- No keyboard handler is built in; any keyboard-driven resize behavior must be implemented by the consumer.
- Consumers should ensure a visible focus indicator via their own CSS.

Related references:
- WAI-ARIA Region Role: https://www.w3.org/TR/wai-aria-1.2/#region
- WAI-ARIA Window Splitter Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/

## Related components

- `Splitter` - draggable separator between two panels, uses `role="separator"`.
- `ScrollArea` - focusable scroll container without resize semantics.
- `Sidebar` - complementary landmark without resize behavior.
- `SlideOutDrawer` / `Sheet` - modal overlay panels.
