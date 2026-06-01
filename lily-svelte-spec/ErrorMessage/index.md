# ErrorMessage

A single error message that announces itself to screen readers. Renders `<p role="alert">`, which creates an implicit assertive live region.

## What it is

`ErrorMessage` is a minimal paragraph with `role="alert"`. Because `alert` is an assertive live region, the error text is announced by screen readers as soon as the element enters the DOM. Render it only when an error exists so that each appearance triggers a fresh announcement.

## What it does

- Renders `<p class="error-message" role="alert">` with the supplied children.
- Forwards `restProps` onto the `<p>`.

## When to use it

- Inline form field errors shown below an input.
- Per-field validation feedback after a submit attempt.
- Any transient error text that should be announced immediately.

## When not to use it

- For a summary of all form errors. Use `ErrorSummary` instead.
- For static, always-visible error text that should not be announced. Use a plain `<p>`.
- For long-lived error banners. Use `Alert` with `Banner` or a `Notification`.

## How to use it

Render conditionally when there is an error to display.

```svelte
<script lang="ts">
    import ErrorMessage from "./ErrorMessage.svelte";
    let error = $state("");
</script>

{#if error}
    <ErrorMessage>{error}</ErrorMessage>
{/if}
```

## Props

| Prop       | Type       | Default | Description                              |
| ---------- | ---------- | ------- | ---------------------------------------- |
| `class`    | `string`   | `""`    | CSS class appended to the base class.   |
| `children` | `Snippet`  | required| Error message content.                   |
| `...rest`  | `unknown`  | —       | Additional HTML attributes on the `<p>`. |

## Usage

### 1. Inline error message

```svelte
<ErrorMessage>Password is required</ErrorMessage>
```

### 2. Conditional display

```svelte
{#if error}
    <ErrorMessage>{error}</ErrorMessage>
{/if}
```

### 3. Associated with an input via `aria-errormessage`

```svelte
<input id="email" aria-invalid={!!error} aria-errormessage="email-error" />
{#if error}
    <ErrorMessage id="email-error">{error}</ErrorMessage>
{/if}
```

### 4. Multiple field errors

```svelte
{#each Object.entries(errors) as [field, msg]}
    {#if msg}
        <ErrorMessage id={`${field}-error`}>{msg}</ErrorMessage>
    {/if}
{/each}
```

### 5. Formatted content

```svelte
<ErrorMessage>
    Passwords must be at least <strong>8 characters</strong>.
</ErrorMessage>
```

## Accessibility

- `role="alert"` creates an implicit `aria-live="assertive"` region.
- Ensure the element appears (or re-appears) at the moment of error — screen readers only announce when the live region changes.
- Pair with `aria-invalid` and `aria-errormessage` on the associated input for robust form error semantics.

## Related components

- `ErrorSummary` — consolidated summary of all form errors.
- `Field` — includes a built-in error paragraph with `role="alert"`.
- `Alert` — generic status message.
- `Hint` — non-error helper text.
