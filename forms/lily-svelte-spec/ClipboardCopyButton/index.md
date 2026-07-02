# ClipboardCopyButton

A headless `<button>` that copies a supplied string to the system clipboard using `navigator.clipboard.writeText`. It tracks an internal `copied` state that automatically resets after 2 seconds and is exposed via `data-copied` so consumers can style a "Copied!" visual state.

## What it is

ClipboardCopyButton is a Svelte 5 component that renders a button with an internal `copied` state (`$state`). On click, it calls the Clipboard API, toggles `copied` to `true`, fires the optional `onsuccess` callback, and schedules a reset after 2 000 ms. If the call fails, it fires the optional `onerror` callback.

## What it does

- Renders `<button type="button" aria-label={label} data-copied={copied}>`.
- Writes `text` to the clipboard when clicked.
- Exposes `copied` state through the `data-copied` attribute.
- Calls `onsuccess()` on success and `onerror(err)` on failure.

## When to use it

- "Copy link", "Copy code", "Copy command" affordances on code blocks, share dialogs, and output panels.
- Anywhere a user benefits from one-click copy to clipboard with immediate visual feedback.

## When not to use it

- When the consumer needs a non-interactive copy trigger — use a custom button with your own logic.
- For copying rich content (HTML, images) — the component only handles plain text via `writeText`.
- In environments where the Clipboard API is not available — wrap your own fallback.

## How to use it

Provide `text` (what to copy) and `label` (the accessible name of the button). Use `onsuccess` to show a toast, and CSS against `[data-copied="true"]` for inline feedback.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `class` | `string` | `""` | CSS class name appended to the base class. |
| `text` | `string` | required | Text to write to the clipboard. |
| `label` | `string` | required | `aria-label` for the button. |
| `onsuccess` | `() => void` | `undefined` | Called after a successful write. |
| `onerror` | `(error: unknown) => void` | `undefined` | Called if the write fails. |
| `children` | `Snippet` | `undefined` | Optional custom button content. |
| `...restProps` | `unknown` | — | Additional attributes spread onto the `<button>`. |

## Usage

```svelte
<script lang="ts">
    import ClipboardCopyButton from "./ClipboardCopyButton.svelte";
</script>

<ClipboardCopyButton text="https://example.com" label="Copy link" />
```

```svelte
<script lang="ts">
    import ClipboardCopyButton from "./ClipboardCopyButton.svelte";

    const code = "npm install lily-design-system-svelte-headless";
</script>

<ClipboardCopyButton text={code} label="Copy install command">
    Copy command
</ClipboardCopyButton>
```

```svelte
<script lang="ts">
    import ClipboardCopyButton from "./ClipboardCopyButton.svelte";

    let message = $state("");
</script>

<ClipboardCopyButton
    text="Share: https://example.com/post/42"
    label="Copy share link"
    onsuccess={() => (message = "Copied!")}
    onerror={(e) => (message = `Copy failed: ${String(e)}`)}
>
    Copy
</ClipboardCopyButton>
<p aria-live="polite">{message}</p>
```

```svelte
<script lang="ts">
    import ClipboardCopyButton from "./ClipboardCopyButton.svelte";

    let email = $state("joel@example.com");
</script>

<ClipboardCopyButton text={email} label="Copy email address">
    {email}
</ClipboardCopyButton>
```

## Accessibility

- The native `<button>` supplies button semantics, focus, Enter/Space activation.
- `aria-label` names the button, which is especially important when `children` is empty.
- `data-copied` is a CSS hook only — pair with an `aria-live` message (e.g. outside the button) so screen readers also hear the success.

## Related components

- `Button` — generic button.
- `Toast`, `Sonner` — notification surfaces for success/error feedback.
