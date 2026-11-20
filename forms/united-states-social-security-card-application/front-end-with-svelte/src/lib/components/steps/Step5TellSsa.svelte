<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import { OPTIONS } from '#lib/engine/utils.js';

  const v = assessment.data.tellSsa;
</script>

<Fieldset legend="Step 5 of 6 — Tell SSA: death-related items">
  <p class="hint">
    SSA does not issue a card for a person who has died. If the person has died, report the death
    instead of applying.
  </p>

  <Field label="Has the person in item 1 died?" inputId="tellSsa-applicantDeceased">
    <Select
      id="tellSsa-applicantDeceased"
      label="Has the person in item 1 died?"
      bind:value={v.applicantDeceased}
    >
      <option value="">— Select —</option>
      {#each OPTIONS.yesNo as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
  <Field label="Has the death already been reported to SSA?" inputId="tellSsa-deathReportedToSsa">
    <Select
      id="tellSsa-deathReportedToSsa"
      label="Has the death already been reported to SSA?"
      bind:value={v.deathReportedToSsa}
    >
      <option value="">— Select —</option>
      {#each OPTIONS.yesNo as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </Select>
  </Field>
  <p class="hint">The funeral home usually reports it, or call 1-800-772-1213.</p>
  <Field label="Preparer note" inputId="tellSsa-preparerNote">
    <TextAreaInput
      id="tellSsa-preparerNote"
      label="Preparer note"
      rows={3}
      placeholder="Free-text note from the person preparing the application."
      bind:value={v.preparerNote}
    />
  </Field>
</Fieldset>
