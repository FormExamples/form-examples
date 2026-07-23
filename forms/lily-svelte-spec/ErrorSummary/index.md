# ErrorSummary

A consolidated list of form validation errors shown at the top of a form. Uses `role="alert"`, `aria-labelledby` to its heading, and `tabindex="-1"` for programmatic focus after submit.

## What it is

`ErrorSummary` follows the GOV.UK / NHS England error summary pattern. It renders a `<div role="alert">` containing an `<h2>` title and a consumer-provided list of linked errors. The heading ID is auto-generated and wired to `aria-labelledby`. The container is focusable via `tabindex="-1"` so consumers can move focus to it after a submit attempt.

## What it does

- Renders `<div role="alert" aria-labelledby={titleId} tabindex="-1">`.
- Generates a unique ID for the heading and wires it to `aria-labelledby`.
- Renders `<h2 id={titleId}>{title}</h2>` followed by the children.
- Does not render anything inside the list automatically — the consumer owns the list markup.

## When to use it

- Above a form after a failed submit, summarising every field that needs attention.
- Accessibility-first forms that must announce validation outcomes audibly.
- Complex multi-field forms where users need a jumplist to errors.

## When not to use it

- For a single inline field error. Use `ErrorMessage` or `Field` instead.
- For non-form errors (e.g. network failures). Use `Alert` or `Notification`.
- When there are no errors — render it only when errors exist.

## How to use it

Render when errors exist; move focus to the summary after submit.

```svelte
<script lang="ts">
    import ErrorSummary from "./ErrorSummary.svelte";
    let ref: HTMLElement | undefined = $state();
    let errors = $state<{ id: string; message: string }[]>([]);
    $effect(() => { if (errors.length) ref?.focus(); });
</script>

{#if errors.length}
    <ErrorSummary title="There is a problem" bind:this={ref}>
        <ul>
            {#each errors as e}
                <li><a href={`#${e.id}`}>{e.message}</a></li>
            {/each}
        </ul>
    </ErrorSummary>
{/if}
```

## Props

| Prop       | Type       | Default  | Description                                     |
| ---------- | ---------- | -------- | ----------------------------------------------- |
| `class`    | `string`   | `""`     | CSS class appended to the base class.          |
| `title`    | `string`   | required | Heading text for the summary.                   |
| `children` | `Snippet`  | required | List of error links (typically a `<ul>`).       |
| `...rest`  | `unknown`  | —        | Additional HTML attributes on the `<div>`.      |

## Usage

### 1. List of linked errors

```svelte
<ErrorSummary title="There is a problem">
    <ul>
        <li><a href="#name">Enter your name</a></li>
        <li><a href="#email">Enter a valid email address</a></li>
    </ul>
</ErrorSummary>
```

### 2. Single error

```svelte
<ErrorSummary title="Please fix the following">
    <ul>
        <li><a href="#password">Password must be at least 8 characters</a></li>
    </ul>
</ErrorSummary>
```

### 3. Focus on submit

```svelte
<script lang="ts">
    import ErrorSummary from "./ErrorSummary.svelte";
    let summaryEl: HTMLElement | undefined = $state();
    function submit() {
        validate();
        if (errors.length) summaryEl?.focus();
    }
</script>

<ErrorSummary title="Errors" bind:this={summaryEl}>
    <ul>{#each errors as e}<li><a href={`#${e.id}`}>{e.message}</a></li>{/each}</ul>
</ErrorSummary>
```

### 4. Paired with `Form` and `Field`

```svelte
<form onsubmit={submit}>
    {#if errors.length}
        <ErrorSummary title="There is a problem">
            <ul>
                {#each errors as e}
                    <li><a href={`#${e.id}`}>{e.message}</a></li>
                {/each}
            </ul>
        </ErrorSummary>
    {/if}
    <Field label="Name" error={errors.name}>
        <TextInput label="Name" bind:value={name} />
    </Field>
</form>
```

### 5. Localised title

```svelte
<ErrorSummary title="Il y a un problème">
    <ul><li><a href="#email">Entrez un e-mail valide</a></li></ul>
</ErrorSummary>
```

## Accessibility

- `role="alert"` ensures the summary is announced when it appears.
- `aria-labelledby` links the live region to its heading.
- `tabindex="-1"` allows focus via `element.focus()` after a failed submit.
- Error links should point to each field's ID so users can jump directly.

## Related components

- `ErrorMessage` — single inline error.
- `Field` — field wrapper with built-in error paragraph.
- `Alert` — generic status message.
- `Form` — form wrapper for submit handling.

---

Lily™ and Lily Design System™ are trademarks.
