<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import { STATE_OPTIONS } from '#lib/config/states.js';

  const p = assessment.data.buyer;
</script>

<Fieldset legend="Step 3 of 7 — Buyer (transferee)">
  <p class="hint">Who is buying the vehicle: printed name, current address, and signature.</p>

  <Field label="Buyer printed name" inputId="buyer-name">
    <TextInput
      id="buyer-name"
      label="Buyer printed name"
      placeholder="Full legal name"
      bind:value={p.name}
    />
  </Field>

  <Field label="Buyer is" inputId="buyer-type">
    <Select id="buyer-type" label="Buyer is" bind:value={p.type}>
      <option value="">— Select —</option>
      <option value="individual">Individual</option>
      <option value="business">Business</option>
    </Select>
  </Field>

  <Field label="Buyer street address" inputId="buyer-streetAddress">
    <TextInput id="buyer-streetAddress" label="Buyer street address" bind:value={p.streetAddress} />
  </Field>
  <p class="hint">The current address is required on the federal odometer disclosure.</p>

  <Field label="Buyer city" inputId="buyer-city">
    <TextInput id="buyer-city" label="Buyer city" bind:value={p.city} />
  </Field>

  <Field label="Buyer state" inputId="buyer-state">
    <Select id="buyer-state" label="Buyer state" bind:value={p.state}>
      <option value="">— Select —</option>
      {#each STATE_OPTIONS as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>

  <Field label="Buyer ZIP code" inputId="buyer-postalCode">
    <TextInput
      id="buyer-postalCode"
      label="Buyer ZIP code"
      placeholder="12345 or 12345-6789"
      bind:value={p.postalCode}
    />
  </Field>

  <Field label="Buyer telephone" inputId="buyer-phone">
    <TextInput id="buyer-phone" label="Buyer telephone" bind:value={p.phone} />
  </Field>

  <Field label="Buyer has signed the bill of sale?" inputId="buyer-signed">
    <Select id="buyer-signed" label="Buyer has signed the bill of sale?" bind:value={p.signed}>
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
