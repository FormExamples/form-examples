# TelLink

A click-to-call telephone hyperlink rendered as `<a href="tel:…">` that allows users on telephony-capable devices to initiate a phone call.

## What it is

`TelLink` is a headless Svelte 5 component that renders an `<a>` anchor with a `tel:` protocol URL. It is the read-only, presentational counterpart to `TelInput` in the Input/Link pattern: `TelInput` collects or edits a phone number; `TelLink` displays it as an actionable link.

## What it does

- Renders `<a class="tel-link {className}" href="tel:{phone}">{phone}</a>`.
- Optionally adds `aria-label` when a `label` prop is provided, giving screen readers extra context beyond the raw number.
- Spreads additional HTML attributes onto the `<a>` element.
- Holds no internal state — it is purely presentational.

## When to use it

- Contact pages, footers, or business listings with a callable phone number.
- Customer support sections where tapping the number should start a call on mobile.
- Patient portal or healthcare directories linking to a clinic phone.
- Anywhere a phone number should be interactive rather than plain text.

## When not to use it

- Don't use it as an input — use `TelInput`.
- Don't use it for email addresses — use `EmailLink`.
- Don't use it for generic links — use `ActionLink` or a plain `<a>`.
- Don't rely on `tel:` activation for desktop-only audiences unless they have a softphone configured.

## How to use it

Import the component and pass the `phone` number including country code. Optionally pass `label` to give screen readers more context, such as "Call customer support".

## Props

- `class` — string, optional. Extra CSS class appended to `tel-link`.
- `phone` — string, required. The telephone number to display and link to (include country code, e.g. `+1-555-0100`).
- `label` — string, optional. Accessible name via `aria-label` for additional context.
- `...restProps` — any additional HTML attributes spread onto the `<a>` (e.g. `id`, `data-*`, `target`).

## Usage

```svelte
<script lang="ts">
  import TelLink from "./TelLink.svelte";
</script>

<TelLink phone="+1-555-0100" />
```

```svelte
<script lang="ts">
  import TelLink from "./TelLink.svelte";
</script>

<TelLink phone="+1-555-0100" label="Call customer support" />
```

```svelte
<script lang="ts">
  import TelInput from "../TelInput/TelInput.svelte";
  import TelLink from "./TelLink.svelte";

  let phone = $state("+1-555-0100");
  let editing = $state(false);
</script>

{#if editing}
  <TelInput label="Phone" bind:value={phone} />
  <button type="button" onclick={() => (editing = false)}>Save</button>
{:else}
  <TelLink phone={phone} label="Primary phone number" />
  <button type="button" onclick={() => (editing = true)}>Edit</button>
{/if}
```

```svelte
<script lang="ts">
  import TelLink from "./TelLink.svelte";

  const contacts = [
    { name: "Sales", phone: "+1-555-0110" },
    { name: "Support", phone: "+1-555-0120" },
  ];
</script>

<ul>
  {#each contacts as c}
    <li>
      {c.name}: <TelLink phone={c.phone} label={`Call ${c.name}`} />
    </li>
  {/each}
</ul>
```

## Accessibility

- Native `<a>` element provides the link role and keyboard activation (Enter).
- `aria-label`, when provided, becomes the accessible name and overrides the visible phone text for assistive technology — only use it to add context.
- On devices without telephony, the `tel:` URL is typically handled by associated apps (FaceTime, Skype, etc.).

## Related components

- `TelInput` — paired input component for entering/editing the phone number.
- `EmailLink` / `EmailInput` — analogous Input/Link pair for email.
- `ActionLink` — generic styled action hyperlink.
- `DigitalObjectIdentifierLink` — persistent DOI hyperlink.

---

Lily™ and Lily Design System™ are trademarks.
