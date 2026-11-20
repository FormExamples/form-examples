<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const o = assessment.data.order;
</script>

<Fieldset legend="Step 4 of 6 — Certificate order">
  <p class="hint">
    The kind and number of copies, how you will submit, and the fee. Passports and apostilles need
    the certified long form.
  </p>

  <Field label="Type of copy" inputId="order-certificateType">
    <Select id="order-certificateType" label="Type of copy" bind:value={o.certificateType}>
      <option value="">— Select —</option>
      <option value="certified-long-form">Certified long form (full image of the record)</option>
      <option value="certified-short-form">Certified short form (abstract)</option>
      <option value="informational">Informational copy (not valid for identity)</option>
    </Select>
  </Field>

  <Field label="Number of copies" inputId="order-copies">
    <NumberInput
      id="order-copies"
      label="Number of copies"
      min={1}
      max={20}
      bind:value={o.copies}
    />
  </Field>

  <Field label="How will you submit the request?" inputId="order-deliveryMethod">
    <Select
      id="order-deliveryMethod"
      label="How will you submit the request?"
      bind:value={o.deliveryMethod}
    >
      <option value="">— Select —</option>
      <option value="online">Online</option>
      <option value="mail">By mail</option>
      <option value="in-person">In person</option>
    </Select>
  </Field>

  <Field label="Total fee enclosed (US dollars)" inputId="order-feeEnclosedUsd">
    <NumberInput
      id="order-feeEnclosedUsd"
      label="Total fee enclosed (US dollars)"
      min={0}
      bind:value={o.feeEnclosedUsd}
    />
  </Field>
</Fieldset>
