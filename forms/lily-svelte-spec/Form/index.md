# Form

A form wrapper around the native HTML `<form>` element with accessible labelling, automatic submit default prevention, and reset support. Simplifies form handling by intercepting the submit event and calling `event.preventDefault()` before passing the event to the consumer.

## What it is

A Svelte 5 component that renders a `<form>` element with `aria-label`, attaches an internal submit handler that calls `event.preventDefault()` before invoking the consumer's `onsubmit`, and forwards the `onreset` callback directly.

## What it does

- Renders `<form class="form ..." aria-label={label}>` wrapping the `children` snippet.
- Wraps the consumer `onsubmit` in a handler that first calls `event.preventDefault()`, then calls the consumer callback with the original `SubmitEvent`.
- Forwards `onreset` directly to the `<form>` element without modification.
- Spreads any additional HTML attributes onto the `<form>` element.

## When to use it

- Any single-page app form where `event.preventDefault()` is the default behaviour you want.
- Forms that need an accessible name for screen readers to describe their purpose.
- As the outer container in the Form → Field → Input composition pattern.

## When not to use it

- Server-rendered forms where native full-page submit is required. Use a raw `<form>` and handle submission server-side.
- Forms that should not prevent default. The internal handler always calls `preventDefault()`.
- Inline editing without a full form submit. Use `EditableForm` or direct input components.
- Filtering without a submit lifecycle. Use `DataFilterForm`.

## How to use it

Import the component, pass a required `label` describing the form's purpose, and supply an `onsubmit` handler that receives the `SubmitEvent` (already prevented). Compose inputs and buttons as children.

## Props

- `class` (string, optional) - CSS class appended after the base `form` class.
- `label` (string, required) - Accessible name for the form via `aria-label`.
- `onsubmit` ((event: SubmitEvent) => void, optional) - Submit callback. Default already prevented.
- `onreset` ((event: Event) => void, optional) - Reset callback.
- `children` (Snippet, required) - Form content.
- `...restProps` - Additional HTML attributes spread onto the `<form>` element.

## Usage

```svelte
<script lang="ts">
    import Form from "./Form.svelte";
    import Field from "../Field/Field.svelte";
    import TextInput from "../TextInput/TextInput.svelte";
    import Button from "../Button/Button.svelte";

    let name = $state("");
    let email = $state("");
    function handleSubmit() {
        console.log({ name, email });
    }
</script>

<Form label="Contact" onsubmit={handleSubmit}>
    <Field label="Name">
        <TextInput label="Name" bind:value={name} />
    </Field>
    <Field label="Email">
        <TextInput label="Email" bind:value={email} />
    </Field>
    <Button type="submit" label="Submit">Submit</Button>
</Form>
```

```svelte
<script lang="ts">
    import Form from "./Form.svelte";
    function handleLogin(event: SubmitEvent) {
        const data = new FormData(event.target as HTMLFormElement);
        console.log(Object.fromEntries(data));
    }
</script>

<Form label="Login" onsubmit={handleLogin}>
    <label>Email <input name="email" type="email" required /></label>
    <label>Password <input name="password" type="password" required /></label>
    <button type="submit">Sign in</button>
</Form>
```

```svelte
<script lang="ts">
    import Form from "./Form.svelte";
    let query = $state("");

    function applyFilters() { console.log("apply", query); }
    function clearFilters() { query = ""; }
</script>

<Form
    label="Search filters"
    onsubmit={applyFilters}
    onreset={clearFilters}
>
    <input name="query" bind:value={query} />
    <button type="submit">Apply</button>
    <button type="reset">Clear</button>
</Form>
```

```svelte
<script lang="ts">
    import Form from "./Form.svelte";
    import ErrorSummary from "../ErrorSummary/ErrorSummary.svelte";
    let errors = $state<{ name?: string }>({});

    function handleSubmit() {
        errors = { name: "Required" };
    }
</script>

<Form label="Signup" onsubmit={handleSubmit}>
    {#if errors.name}
        <ErrorSummary title="There is a problem">
            <ul><li>{errors.name}</li></ul>
        </ErrorSummary>
    {/if}
    <label>Name <input name="name" /></label>
    <button type="submit">Submit</button>
</Form>
```

```svelte
<script lang="ts">
    import Form from "./Form.svelte";
</script>

<Form
    label="Upload"
    onsubmit={() => {}}
    class="upload-form"
    data-testid="upload-form"
    method="post"
    enctype="multipart/form-data"
>
    <input type="file" name="file" />
    <button type="submit">Upload</button>
</Form>
```

## Accessibility

- `aria-label` describes the form's purpose to assistive technology.
- Native `<form>` Enter-to-submit behaviour is preserved (Enter in a text input submits the form).
- `preventDefault` on submit keeps users on-page; consumers are responsible for feedback (live regions, error messages).
- Use `Field`, `Label`, `Hint`, and `ErrorMessage` inside the form for accessible per-input wiring.

## Related components

- `Field` - wraps a label, input, hint, and error message for a single form control.
- `Fieldset` - groups related fields with a legend.
- `ErrorSummary` - summary of all validation errors.
- `ErrorMessage` - per-field error message.
- `DataFilterForm` - a form specialised for data filtering.
- `EditableForm` - form wrapper for inline editing.

---

Lily™ and Lily Design System™ are trademarks.
