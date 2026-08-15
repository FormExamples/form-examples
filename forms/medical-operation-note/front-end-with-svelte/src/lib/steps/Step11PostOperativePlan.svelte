<script lang="ts">
  import { store } from '#lib/state.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';
</script>

<Fieldset legend="Step 11 — Post-operative plan">
  <div class="field-grid">
    <Field label="Recovery destination">
      <Select
        label="Recovery destination"
        bind:value={store.data.postOperativePlan.recoveryDestination}
      >
        <option value="">—</option>
        <option value="pacu">PACU</option>
        <option value="ward">Ward</option>
        <option value="enhanced-care">Enhanced care</option>
        <option value="hdu">HDU</option>
        <option value="icu">ICU</option>
        <option value="day-case-discharge">Day-case discharge</option>
      </Select>
    </Field>
    <Field label="Unplanned escalation of disposition">
      <Select
        label="Unplanned escalation of disposition"
        bind:value={store.data.postOperativePlan.unplannedEscalation}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Monitoring frequency">
      <TextInput
        label="Monitoring frequency"
        bind:value={store.data.postOperativePlan.monitoringFrequency}
      />
    </Field>
    <Field label="IV fluids plan">
      <TextInput label="IV fluids plan" bind:value={store.data.postOperativePlan.ivFluidsPlan} />
    </Field>
    <Field label="Analgesia plan" class="field-span-2">
      <TextAreaInput
        label="Analgesia plan"
        rows={2}
        bind:value={store.data.postOperativePlan.analgesiaPlan}
      />
    </Field>
    <Field label="Antibiotics plan">
      <TextInput label="Antibiotics plan" bind:value={store.data.postOperativePlan.antibioticsPlan} />
    </Field>
    <Field label="VTE prophylaxis">
      <TextInput label="VTE prophylaxis" bind:value={store.data.postOperativePlan.vteProphylaxis} />
    </Field>
    <Field label="Diet">
      <TextInput label="Diet" bind:value={store.data.postOperativePlan.diet} />
    </Field>
    <Field label="Mobilisation">
      <TextInput label="Mobilisation" bind:value={store.data.postOperativePlan.mobilisation} />
    </Field>
    <Field label="Wound care" class="field-span-2">
      <TextInput label="Wound care" bind:value={store.data.postOperativePlan.woundCare} />
    </Field>
    <Field label="Drain removal plan" class="field-span-2">
      <TextInput
        label="Drain removal plan"
        bind:value={store.data.postOperativePlan.drainRemovalPlan}
      />
    </Field>
    <Field label="Follow-up plan" class="field-span-2">
      <TextInput
        label="Follow-up plan"
        bind:value={store.data.postOperativePlan.followUpPlan}
      />
    </Field>
    <Field label="Special instructions" class="field-span-2">
      <TextAreaInput
        label="Special instructions"
        rows={2}
        bind:value={store.data.postOperativePlan.specialInstructions}
      />
    </Field>
    <Field label="WHO Sign-Out completed">
      <Select
        label="WHO Sign-Out completed"
        bind:value={store.data.postOperativePlan.whoSignOutCompleted}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Debrief completed">
      <Select
        label="Debrief completed"
        bind:value={store.data.postOperativePlan.debriefCompleted}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
  </div>
</Fieldset>
