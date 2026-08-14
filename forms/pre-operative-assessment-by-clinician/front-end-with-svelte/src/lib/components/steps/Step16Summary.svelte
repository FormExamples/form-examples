<script lang="ts">
  import { store } from '$lib/stores/assessment.svelte.js';
  import FlagBanner from '$lib/components/ui/FlagBanner.svelte';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

  const r = $derived(store.result);

  const discussionTopics = [
    ['discussionProcedure', 'Procedure'],
    ['discussionAnaesthetic', 'Anaesthetic'],
    ['discussionRisksBenefits', 'Risks / benefits'],
    ['discussionAlternatives', 'Alternatives'],
  ] as const;
</script>

<Fieldset legend="Step 16 — Summary, ASA and sign-off">
  <div class="summary-box">
    <p><strong>Computed ASA grade:</strong> {r.computedAsaGrade}{r.asaEmergencySuffix}</p>
    <p><strong>Mallampati:</strong> {r.mallampatiClass || '—'}</p>
    <p><strong>RCRI score:</strong> {r.rcriScore}</p>
    <p><strong>STOP-BANG score:</strong> {r.stopbangScore}</p>
    <p><strong>Clinical Frailty Scale:</strong> {r.frailtyScale ?? '—'}</p>
    <p><strong>Fried Frailty Phenotype:</strong> {r.friedPhenotypeScore ?? '—'}{r.friedFrailtyCategory ? ` (${r.friedFrailtyCategory})` : ''}</p>
    <p><strong>Composite risk:</strong> {r.compositeRisk.toUpperCase()}</p>
  </div>

  <FlagBanner flags={r.additionalFlags} risk={r.compositeRisk} />

  {#if r.firedRules.length > 0}
    <details class="fired-rules">
      <summary>Fired rules ({r.firedRules.length})</summary>
      <ul>
        {#each r.firedRules as f}
          <li><code>{f.ruleId}</code> [{f.instrument}] — {f.description}</li>
        {/each}
      </ul>
    </details>
  {/if}

  <div class="field-grid">
    <Field label="Final ASA (override)">
      <Select label="Final ASA (override)" bind:value={store.data.summary.finalAsaGrade}>
        <option value="">Use computed ({r.computedAsaGrade})</option>
        <option value="I">I</option>
        <option value="II">II</option>
        <option value="III">III</option>
        <option value="IV">IV</option>
        <option value="V">V</option>
        <option value="VI">VI</option>
      </Select>
    </Field>
    <Field label="Recommendation">
      <Select label="Recommendation" bind:value={store.data.summary.recommendation}>
        <option value="">—</option>
        <option value="proceed">Proceed</option>
        <option value="optimise-first">Optimise first</option>
        <option value="mdt-review">MDT review</option>
        <option value="cancel">Cancel</option>
      </Select>
    </Field>
    <Field
      label="Override reason (required if overriding)"
      class="field-span-2"
      inputId="step-16-override-reason"
      error={store.errors['step-16-override-reason']}
    >
      <TextInput
        id="step-16-override-reason"
        label="Override reason"
        bind:value={store.data.summary.overrideReason}
        aria-invalid={store.errors['step-16-override-reason'] ? 'true' : undefined}
      />
    </Field>
    <Field label="Clinician notes" class="field-span-2">
      <TextAreaInput label="Clinician notes" rows={4} bind:value={store.data.summary.clinicianNotes} />
    </Field>
  </div>

  <h3 class="step-subhead">Patient education and consent</h3>
  <div class="field-grid">
    <Field label="Consent status">
      <Select label="Consent status" bind:value={store.data.summary.consentStatus}>
        <option value="">—</option>
        <option value="obtained">Obtained</option>
        <option value="pending">Pending</option>
        <option value="declined">Declined</option>
        <option value="unable-to-consent">Unable to consent</option>
      </Select>
    </Field>
    <Field label="Interpreter required">
      <Select label="Interpreter required" bind:value={store.data.summary.interpreterRequired}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
  </div>
  <h4 class="step-subhead">Discussion held regarding</h4>
  <div class="field-grid field-grid-4">
    {#each discussionTopics as [key, label]}
      <Field {label}>
        <Select {label} bind:value={store.data.summary[key]}>
          <option value="">—</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </Select>
      </Field>
    {/each}
  </div>

  <p class="signoff-note">
    By signing, the clinician confirms that the assessment above was made on
    objective findings and that the anaesthesia plan is appropriate. Signed
    timestamp will be added on submission.
  </p>
</Fieldset>
