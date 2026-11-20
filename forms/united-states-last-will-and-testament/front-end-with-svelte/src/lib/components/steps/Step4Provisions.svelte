<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextAreaInput, TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';

  const p = assessment.data.provisions;
</script>

<Fieldset legend="Step 4 of 6 — Representative and clauses">
  <p class="hint">
    The personal representative (executor) and the standard clauses a will should carry.
  </p>

  <Field
    label="Personal representative (executor) — name"
    inputId="provisions-personalRepresentativeName"
  >
    <TextInput
      id="provisions-personalRepresentativeName"
      label="Personal representative (executor) — name"
      bind:value={p.personalRepresentativeName}
    />
  </Field>

  <Field
    label="Successor personal representative — name"
    inputId="provisions-successorPersonalRepresentativeName"
  >
    <TextInput
      id="provisions-successorPersonalRepresentativeName"
      label="Successor personal representative — name"
      bind:value={p.successorPersonalRepresentativeName}
    />
  </Field>

  <Field label="Is the bond waived?" inputId="provisions-bondWaived">
    <Select id="provisions-bondWaived" label="Is the bond waived?" bind:value={p.bondWaived}>
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Does the will revoke all earlier wills and codicils?"
    inputId="provisions-revokesPriorWillsClause"
  >
    <Select
      id="provisions-revokesPriorWillsClause"
      label="Does the will revoke all earlier wills and codicils?"
      bind:value={p.revokesPriorWillsClause}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Does the will contain a no-contest clause?" inputId="provisions-noContestClause">
    <Select
      id="provisions-noContestClause"
      label="Does the will contain a no-contest clause?"
      bind:value={p.noContestClause}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field
    label="Does the will authorize access to digital assets?"
    inputId="provisions-digitalAssetsClause"
  >
    <Select
      id="provisions-digitalAssetsClause"
      label="Does the will authorize access to digital assets?"
      bind:value={p.digitalAssetsClause}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Has a tax adviser reviewed estate tax?" inputId="provisions-estateTaxReviewed">
    <Select
      id="provisions-estateTaxReviewed"
      label="Has a tax adviser reviewed estate tax?"
      bind:value={p.estateTaxReviewed}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Where is the signed original kept?" inputId="provisions-originalWillLocation">
    <TextInput
      id="provisions-originalWillLocation"
      label="Where is the signed original kept?"
      placeholder="e.g. fireproof safe at home; attorney vault"
      bind:value={p.originalWillLocation}
    />
  </Field>

  <Field label="Drafter note" inputId="provisions-drafterNote">
    <TextAreaInput
      id="provisions-drafterNote"
      label="Drafter note"
      rows={3}
      placeholder="Free-text note for the file."
      bind:value={p.drafterNote}
    />
  </Field>
</Fieldset>
