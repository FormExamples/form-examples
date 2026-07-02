# HiddenInput

A hidden form input that renders a native `<input type="hidden">` element for passing data in form submissions without any visible or editable UI. Useful for CSRF tokens, record IDs, or any non-displayed metadata.

## What it is

A Svelte 5 thin wrapper around `<input type="hidden">` with a required `name` and an optional `value`. The hidden input is not visible, not focusable, and not perceivable by users.

## What it does

- Renders `<input class="hidden-input ..." type="hidden" name={name} value={value}>`.
- Spreads any additional HTML attributes onto the `<input>` element.

## When to use it

- Including non-editable metadata in a form submission (CSRF token, record ID, form step).
- Passing server-side context back on submit without showing it to users.
- Any place a native `<input type="hidden">` is appropriate.

## When not to use it

- For visible text input. Use `TextInput`.
- For form state that is not submitted. Use local component state (e.g. `$state`).
- For client-only secrets. Hidden inputs are still readable in the DOM - do not treat them as secure.
- For password fields. Use `PasswordInput`.

## How to use it

Place inside a `<form>` (or `Form`) and set the `name` and `value` for the data to submit.

## Props

- `class` (string, optional) - CSS class appended after the base `hidden-input` class.
- `name` (string, required) - Form field name.
- `value` (string, default `""`) - Hidden input value.
- `...restProps` - Additional HTML attributes spread onto the `<input>`.

## Usage

```svelte
<script lang="ts">
    import HiddenInput from "./HiddenInput.svelte";
    const csrfToken = "abc123";
</script>

<form method="post">
    <HiddenInput name="csrf" value={csrfToken} />
    <button type="submit">Submit</button>
</form>
```

```svelte
<script lang="ts">
    import HiddenInput from "./HiddenInput.svelte";
    let recordId = $state("42");
</script>

<form>
    <HiddenInput name="record_id" value={recordId} />
    <label>New name <input name="name" /></label>
    <button type="submit">Save</button>
</form>
```

```svelte
<script lang="ts">
    import HiddenInput from "./HiddenInput.svelte";
    let step = $state("2");
</script>

<form>
    <HiddenInput name="wizard_step" value={step} />
    <p>Step {step} of 3</p>
</form>
```

```svelte
<script lang="ts">
    import Form from "../Form/Form.svelte";
    import HiddenInput from "./HiddenInput.svelte";
    function handleSubmit(e: SubmitEvent) {
        const data = new FormData(e.target as HTMLFormElement);
        console.log(Object.fromEntries(data));
    }
</script>

<Form label="Edit record" onsubmit={handleSubmit}>
    <HiddenInput name="id" value="101" />
    <label>Title <input name="title" /></label>
    <button type="submit">Save</button>
</Form>
```

```svelte
<script lang="ts">
    import HiddenInput from "./HiddenInput.svelte";
    const fields = [
        { name: "user_id", value: "u-1" },
        { name: "org_id", value: "o-9" },
    ];
</script>

<form>
    {#each fields as f}
        <HiddenInput name={f.name} value={f.value} data-testid={f.name} />
    {/each}
    <button type="submit">Save</button>
</form>
```

## Accessibility

- No ARIA attributes applied; hidden inputs are not perceivable to any user.
- Not focusable and not in the Tab sequence.
- Consumers should not use hidden inputs to carry user-visible information.

## Related components

- `TextInput` - visible text input.
- `NumberInput` - numeric input.
- `PasswordInput` - password input.
- `Input` - generic HTML input wrapper.
- `Form` - form wrapper with accessibility.
