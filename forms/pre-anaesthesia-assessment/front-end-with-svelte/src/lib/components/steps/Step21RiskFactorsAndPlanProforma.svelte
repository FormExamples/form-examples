<script lang="ts">
  import Field from '#lib/components/ui/Field.svelte';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

  import { store } from '#lib/stores/assessment.svelte.js';

  const r = store.data.riskFactorsChecklist;
  const p = store.data.anaestheticPlanProforma;

  const riskItems = [
    ['cardiac', 'Cardiac'],
    ['respiratory', 'Respiratory'],
    ['diabetes', 'Diabetes'],
    ['insulin', 'Insulin'],
    ['bmiOver40', 'BMI > 40'],
    ['anticoagulants', 'Anticoagulants'],
    ['allergies', 'Allergies'],
    ['antiplatelets', 'Antiplatelets'],
    ['egfrUnder30', 'eGFR < 30'],
    ['egfr30To60', 'eGFR 30-60'],
    ['ageOver70', 'Age > 70 years'],
    ['pvd', 'PVD'],
    ['liverDisease', 'Liver disease'],
    ['vteRisk', 'VTE risk'],
    ['complexNeeds', 'Complex needs'],
    ['anaemia', 'Anaemia'],
    ['neuromuscularDisorders', 'Neuromuscular disorders'],
    ['others', 'Others'],
  ] as const;
</script>

<Fieldset legend="Step 21 — Risk factors, anaesthetic plan and sign-off">
  <h3 class="step-subhead">Risk factors</h3>
  <div class="field-grid field-grid-3">
    {#each riskItems as [key, label]}
      <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={r[key]} /> {label}</label>
    {/each}
  </div>
  {#if r.others}
    <Field label="Please provide details" inputId="othersDetails">
      <TextInput id="othersDetails" label="Please provide details" bind:value={r.othersDetails} />
    </Field>
  {/if}

  <h3 class="step-subhead">Anaesthetic concerns / problems</h3>
  <Field label="Anaesthetic concerns / problems" class="field-span-2">
    <TextAreaInput label="Anaesthetic concerns / problems" rows={3} bind:value={p.anaestheticConcerns} />
  </Field>

  <h3 class="step-subhead">Plan of anaesthesia</h3>
  <div class="field-grid field-grid-3">
    <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={p.planTiva} /> TIVA</label>
    <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={p.planRa} /> RA</label>
    <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={p.planOther} /> Other</label>
  </div>
  {#if p.planOther}
    <Field label="Please provide details" inputId="planOtherDetails">
      <TextInput id="planOtherDetails" label="Please provide details" bind:value={p.planOtherDetails} />
    </Field>
  {/if}

  <h3 class="step-subhead">Pre-op advice</h3>
  <Field label="List for OT / defer / not fit" inputId="listForOtDeferNotFit">
    <Select id="listForOtDeferNotFit" label="List for OT / defer / not fit" bind:value={p.listForOtDeferNotFit}>
      <option value="">-- Select --</option>
      <option value="list-for-ot">List for OT</option>
      <option value="defer">Defer</option>
      <option value="not-fit">Not fit</option>
    </Select>
  </Field>
  <Field label="Nil orally after" inputId="nilOrallyAfter">
    <TextInput id="nilOrallyAfter" label="Nil orally after" bind:value={p.nilOrallyAfter} />
  </Field>
  <div class="field-grid field-grid-3">
    <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={p.informedWrittenConsent} /> Informed written consent</label>
    <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={p.risksBenefitsAlternativesDiscussed} /> Risks, benefits, alternatives discussed</label>
    <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={p.arrangePostOpIcu} /> Arrange post-op ICU</label>
    <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={p.backup} /> Backup</label>
  </div>
  <Field label="Arrange units of blood" inputId="arrangeUnitsOfBlood">
    <TextInput id="arrangeUnitsOfBlood" label="Arrange units of blood" bind:value={p.arrangeUnitsOfBlood} />
  </Field>

  <h3 class="step-subhead">Do the following</h3>
  <Field label="Investigations" inputId="doInvestigations">
    <TextInput id="doInvestigations" label="Investigations" bind:value={p.doInvestigations} />
  </Field>
  <Field label="Special orders" inputId="doSpecialOrders">
    <TextInput id="doSpecialOrders" label="Special orders" bind:value={p.doSpecialOrders} />
  </Field>

  <h3 class="step-subhead">To be reviewed with reports</h3>
  <div class="field-grid field-grid-3">
    <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={p.reviewedHighRiskAnaesthesia} /> High risk anaesthesia</label>
    <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={p.reviewedConsent} /> Consent</label>
  </div>

  <h3 class="step-subhead">Signature</h3>
  <div class="field-grid">
    <Field label="Consultant anaesthesiologist name" inputId="consultantName">
      <TextInput id="consultantName" label="Consultant anaesthesiologist name" bind:value={p.consultantAnaesthesiologistName} />
    </Field>
    <Field label="Consultant anaesthesiologist signature" inputId="consultantSignature">
      <TextInput id="consultantSignature" label="Consultant anaesthesiologist signature" bind:value={p.consultantAnaesthesiologistSignature} />
    </Field>
  </div>
</Fieldset>
