<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput, TextInput } from '@lilydesignsystem/svelte-headless';

  const p = assessment.data.buyer;
</script>

<Fieldset legend="Step 3 of 9 — Buyer">
  <p class="hint">The person buying the vehicle.</p>

  <Field label="Buyer — full name" inputId="buyer-name">
    <TextInput id="buyer-name" label="Buyer — full name" bind:value={p.name} />
  </Field>

  <Field label="Buyer — address" inputId="buyer-address">
    <TextAreaInput id="buyer-address" label="Buyer — address" rows={3} bind:value={p.address} />
  </Field>

  <Field label="Buyer — postcode" inputId="buyer-postcode">
    <TextInput id="buyer-postcode" label="Buyer — postcode" bind:value={p.postcode} />
  </Field>

  <Field label="Buyer — phone" inputId="buyer-phone">
    <TextInput id="buyer-phone" label="Buyer — phone" bind:value={p.phone} />
  </Field>

  <Field label="Buyer — email" inputId="buyer-email">
    <TextInput id="buyer-email" label="Buyer — email" bind:value={p.email} />
  </Field>
</Fieldset>
