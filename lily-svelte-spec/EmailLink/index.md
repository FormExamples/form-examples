# EmailLink

A `mailto:` hyperlink displaying an email address. Clicking it opens the user's default mail client with the address pre-filled.

## What it is

`EmailLink` is a minimal wrapper around an `<a href="mailto:…">`. The address is used for both the visible text and the `href`. An optional `label` can override the accessible name via `aria-label` when the address alone is not descriptive enough.

## What it does

- Renders `<a href="mailto:{email}" aria-label={label}>` displaying `email` as its text content.
- Forwards `restProps` onto the `<a>`.

## When to use it

- Profile pages, contact lists, and team member cards where an email address should be actionable.
- Footer "Contact us" links.
- Any visible email address that should open the user's mail client.

## When not to use it

- For email input. Use `EmailInput` instead.
- When you want to include subject/body parameters, compose the `href` yourself or pass them via `restProps`/`href` as appropriate.
- For telephone links. Use `TelLink`.

## How to use it

Pass the email address as a prop.

```svelte
<script lang="ts">
    import EmailLink from "./EmailLink.svelte";
</script>

<EmailLink email="alice@example.com" />
```

## Props

| Prop      | Type      | Default     | Description                                     |
| --------- | --------- | ----------- | ----------------------------------------------- |
| `class`   | `string`  | `""`        | CSS class appended to the base class.          |
| `email`   | `string`  | required    | The email address (used for text and `href`).   |
| `label`   | `string`  | `undefined` | Optional accessible name override.              |
| `...rest` | `unknown` | —           | Additional HTML attributes on the `<a>`.        |

## Usage

### 1. Basic email link

```svelte
<EmailLink email="alice@example.com" />
```

### 2. With an accessible label override

```svelte
<EmailLink email="support@example.com" label="Contact support team" />
```

### 3. In a contact list

```svelte
<ul>
    {#each team as member}
        <li>{member.name}: <EmailLink email={member.email} /></li>
    {/each}
</ul>
```

### 4. Styled via class

```svelte
<EmailLink email="press@example.com" class="email-link--press" />
```

### 5. With subject via rest props

```svelte
<EmailLink
    email="sales@example.com"
    href="mailto:sales@example.com?subject=Enquiry"
/>
<!-- The explicit href overrides the generated one. -->
```

## Accessibility

- Native `<a>` provides link semantics and Enter/Tab keyboard behaviour.
- `aria-label`, when provided, overrides the accessible name computed from the email text.

## Related components

- `EmailInput` — input for entering an email address.
- `TelLink`, `TelInput` — telephone counterparts.
- `DigitalObjectIdentifierLink` — DOI permanent hyperlink.
- `ActionLink`, `BackLink` — other link variants.
