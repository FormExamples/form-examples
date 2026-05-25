# Fieldset

A headless wrapper around the native `<fieldset>` and `<legend>` elements that groups related form controls.

## What it is

`Fieldset` renders `<fieldset><legend>{legend}</legend>…</fieldset>`. It relies on the platform's built-in group semantics — screen readers announce the legend when focus enters any descendant control, and setting `disabled` on the fieldset disables every descendant form control at once.

## What it does

- Renders `<fieldset class="fieldset" disabled={disabled}>`.
- Renders `<legend>{legend}</legend>` as the first child.
- Renders children after the legend.
- Forwards `restProps` onto the `<fieldset>`.

## When to use it

- Grouping related inputs such as contact info, address, date parts, or payment details.
- Associating a radio group label with the group of radio buttons.
- Conditional editability: toggling `disabled` on the whole group.

## When not to use it

- For individual label/input pairs. Use `Field` instead.
- For a radio group specifically. Use `RadioGroup` which already applies the correct ARIA semantics.
- For purely presentational grouping. Use a `<div>`.

## How to use it

Wrap related controls with a `legend` describing the group.

```svelte
<script lang="ts">
    import Fieldset from "./Fieldset.svelte";
</script>

<Fieldset legend="Contact info">
    <label>Email <input type="email" /></label>
    <label>Phone <input type="tel" /></label>
</Fieldset>
```

## Props

| Prop       | Type       | Default | Description                                    |
| ---------- | ---------- | ------- | ---------------------------------------------- |
| `class`    | `string`   | `""`    | CSS class appended to the base class.         |
| `legend`   | `string`   | required| Text for the `<legend>` element.               |
| `disabled` | `boolean`  | `false` | Disables all descendant form controls.         |
| `children` | `Snippet`  | required| Grouped form controls.                         |
| `...rest`  | `unknown`  | —       | Additional HTML attributes on the `<fieldset>`.|

## Usage

### 1. Contact info group

```svelte
<Fieldset legend="Contact info">
    <Field label="Email"><EmailInput label="Email" /></Field>
    <Field label="Phone"><TelInput label="Phone" /></Field>
</Fieldset>
```

### 2. Conditionally disabled group

```svelte
<Fieldset legend="Shipping address" disabled={usesBillingAddress}>
    <Field label="Street"><TextInput label="Street" /></Field>
    <Field label="City"><TextInput label="City" /></Field>
</Fieldset>
```

### 3. Payment fields

```svelte
<Fieldset legend="Payment">
    <Field label="Card number"><TextInput label="Card number" /></Field>
    <Field label="Expiry"><MonthInput label="Expiry" /></Field>
    <Field label="CVV"><TextInput label="CVV" /></Field>
</Fieldset>
```

### 4. Radio-like group (when not using RadioGroup)

```svelte
<Fieldset legend="Preferred contact">
    <label><input type="radio" name="contact" value="email" /> Email</label>
    <label><input type="radio" name="contact" value="phone" /> Phone</label>
</Fieldset>
```

### 5. Localised legend

```svelte
<Fieldset legend="Información de contacto">
    <label>Correo <input type="email" /></label>
</Fieldset>
```

## Accessibility

- Native `<fieldset>` / `<legend>` expose group semantics automatically.
- Setting `disabled` on the fieldset natively disables all descendants.
- No custom ARIA is needed.

## Related components

- `Field` — label + single input wrapper.
- `RadioGroup`, `CheckboxGroup` — semantic grouping for related controls.
- `Form`, `ErrorSummary` — form-level composition.
