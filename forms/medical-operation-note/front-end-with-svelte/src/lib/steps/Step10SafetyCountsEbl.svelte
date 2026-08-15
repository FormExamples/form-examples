<script lang="ts">
  import { store } from '#lib/state.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import Hint from '#lib/components/ui/Hint.svelte';
</script>

<Fieldset legend="Step 10 — Safety, counts, EBL and complications">
  <h3 class="step-subhead">Counts (WHO Sign-Out)</h3>
  <div class="field-grid field-grid-3">
    <Field label="Swab — first count">
      <NumberInput label="Swab — first count" bind:value={store.data.safetyCountsEbl.swabCountFirst} />
    </Field>
    <Field label="Swab — final count">
      <NumberInput label="Swab — final count" bind:value={store.data.safetyCountsEbl.swabCountFinal} />
    </Field>
    <Field label="Swab agreed">
      <Select label="Swab agreed" bind:value={store.data.safetyCountsEbl.swabCountAgreed}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Needle — first count">
      <NumberInput label="Needle — first count" bind:value={store.data.safetyCountsEbl.needleCountFirst} />
    </Field>
    <Field label="Needle — final count">
      <NumberInput label="Needle — final count" bind:value={store.data.safetyCountsEbl.needleCountFinal} />
    </Field>
    <Field label="Needle agreed">
      <Select label="Needle agreed" bind:value={store.data.safetyCountsEbl.needleCountAgreed}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Instrument — first count">
      <NumberInput label="Instrument — first count" bind:value={store.data.safetyCountsEbl.instrumentCountFirst} />
    </Field>
    <Field label="Instrument — final count">
      <NumberInput label="Instrument — final count" bind:value={store.data.safetyCountsEbl.instrumentCountFinal} />
    </Field>
    <Field label="Instrument agreed">
      <Select label="Instrument agreed" bind:value={store.data.safetyCountsEbl.instrumentCountAgreed}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Count discrepancy resolution" class="field-span-3">
      <TextAreaInput
        label="Count discrepancy resolution"
        rows={2}
        bind:value={store.data.safetyCountsEbl.countDiscrepancyResolution}
      />
    </Field>
  </div>

  <h3 class="step-subhead">Estimated blood loss and transfusion</h3>
  <div class="field-grid field-grid-3">
    <Field label="Estimated blood loss (mL)">
      <NumberInput
        label="Estimated blood loss (mL)"
        bind:value={store.data.safetyCountsEbl.estimatedBloodLossMl}
      />
    </Field>
    <Field label="PRBC (units)">
      <NumberInput label="PRBC (units)" bind:value={store.data.safetyCountsEbl.prbcUnits} />
    </Field>
    <Field label="FFP (units)">
      <NumberInput label="FFP (units)" bind:value={store.data.safetyCountsEbl.ffpUnits} />
    </Field>
    <Field label="Platelets (units)">
      <NumberInput label="Platelets (units)" bind:value={store.data.safetyCountsEbl.plateletsUnits} />
    </Field>
    <Field label="Cryoprecipitate (units)">
      <NumberInput label="Cryoprecipitate (units)" bind:value={store.data.safetyCountsEbl.cryoUnits} />
    </Field>
    <Field label="Massive haemorrhage protocol activated">
      <Select
        label="Massive haemorrhage protocol activated"
        bind:value={store.data.safetyCountsEbl.massiveHaemorrhageProtocolActivated}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
  </div>

  <h3 class="step-subhead">Complications</h3>
  <div class="field-grid">
    <Field label="Clavien–Dindo grade">
      <Select
        label="Clavien–Dindo grade"
        bind:value={store.data.safetyCountsEbl.clavienDindoGrade}
      >
        <option value="">—</option>
        <option value="0">0 — no complication</option>
        <option value="I">I</option>
        <option value="II">II</option>
        <option value="IIIa">IIIa</option>
        <option value="IIIb">IIIb</option>
        <option value="IVa">IVa</option>
        <option value="IVb">IVb</option>
        <option value="V">V — death</option>
      </Select>
    </Field>
    <Field label="Complication description" class="field-span-2">
      <TextInput
        label="Complication description"
        bind:value={store.data.safetyCountsEbl.complicationDescription}
      />
    </Field>
    <Field label="Conversion to open">
      <Select label="Conversion to open" bind:value={store.data.safetyCountsEbl.conversionToOpen}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Retained foreign body">
      <Select
        label="Retained foreign body"
        bind:value={store.data.safetyCountsEbl.retainedForeignBody}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Intra-operative arrest">
      <Select
        label="Intra-operative arrest"
        bind:value={store.data.safetyCountsEbl.intraOperativeArrest}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Specimen labelling issue">
      <Select
        label="Specimen labelling issue"
        bind:value={store.data.safetyCountsEbl.specimenLabellingIssue}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Equipment problem">
      <Select
        label="Equipment problem"
        bind:value={store.data.safetyCountsEbl.equipmentProblem}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Never-event flags" class="field-span-2">
      <TextInput
        label="Never-event flags"
        bind:value={store.data.safetyCountsEbl.neverEventFlags}
      />
      <Hint>
        Comma-separated tokens. Recognised: wrong-site, wrong-side,
        wrong-patient, wrong-procedure, wrong-implant.
      </Hint>
    </Field>
  </div>
</Fieldset>
