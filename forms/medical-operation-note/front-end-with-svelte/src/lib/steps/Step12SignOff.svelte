<script lang="ts">
  import { store } from '#lib/state.svelte.js';
  import FlagBanner from '#lib/components/ui/FlagBanner.svelte';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const r = $derived(store.result);
</script>

<Fieldset legend="Step 12 — Summary, grade and sign-off">
  <div class="summary-box">
    <p><strong>Composite operative risk (computed):</strong> {r.compositeRisk.toUpperCase()}</p>
    <p><strong>Final risk (after override):</strong> {r.finalRisk.toUpperCase()}</p>
    <p><strong>Clavien–Dindo:</strong> {r.clavienDindoGrade}</p>
    <p><strong>Blood-loss band:</strong> {r.bloodLossBand}</p>
    <p><strong>Counts agreed:</strong> {r.countsAgreed ? 'Yes' : 'No / pending'}</p>
    <p><strong>ASA Physical Status:</strong> {r.asaPhysicalStatus ?? '—'}</p>
  </div>

  <FlagBanner flags={r.additionalFlags} risk={r.finalRisk} />

  {#if r.firedRules.length > 0}
    <details class="fired-rules">
      <summary>Fired rules ({r.firedRules.length})</summary>
      <ul>
        {#each r.firedRules as f (f.ruleId)}
          <li><code>{f.ruleId}</code> [{f.instrument}] — {f.description}</li>
        {/each}
      </ul>
    </details>
  {/if}

  <div class="field-grid">
    <Field label="ASA Physical Status (carried over)">
      <NumberInput
        label="ASA Physical Status (1–6)"
        min={1}
        max={6}
        step={1}
        bind:value={store.data.signOff.asaPhysicalStatus}
      />
    </Field>
    <Field label="Surgeon override (composite risk)">
      <Select
        label="Surgeon override (composite risk)"
        bind:value={store.data.signOff.surgeonOverrideRisk}
      >
        <option value="">Use computed ({r.compositeRisk})</option>
        <option value="routine">Routine</option>
        <option value="complicated">Complicated</option>
        <option value="high-risk">High-risk</option>
        <option value="critical">Critical</option>
      </Select>
    </Field>
    <Field
      label="Surgeon override reason (required if overriding)"
      class="field-span-2"
      inputId="step-12-override-reason"
      error={store.errors['step-12-override-reason']}
    >
      <TextAreaInput
        id="step-12-override-reason"
        label="Surgeon override reason"
        rows={2}
        bind:value={store.data.signOff.surgeonOverrideReason}
        aria-invalid={store.errors['step-12-override-reason'] ? 'true' : undefined}
      />
    </Field>
    <Field label="Attestation" class="field-span-2">
      <TextAreaInput
        label="Attestation"
        rows={3}
        bind:value={store.data.signOff.attestation}
      />
    </Field>
    <Field
      label="Electronic signature (printed name)"
      class="field-span-2"
      inputId="step-12-signature"
      error={store.errors['step-12-signature']}
    >
      <TextInput
        id="step-12-signature"
        label="Electronic signature"
        bind:value={store.data.signOff.electronicSignatureName}
        aria-invalid={store.errors['step-12-signature'] ? 'true' : undefined}
      />
    </Field>
    <Field label="Dictation timestamp">
      <input
        class="text-input"
        type="datetime-local"
        aria-label="Dictation timestamp"
        bind:value={store.data.signOff.dictationTimestamp}
      />
    </Field>
    <Field label="Documentation gap declared">
      <Select label="Documentation gap declared" bind:value={store.data.signOff.documentationGap}>
        <option value="">—</option>
        <option value="yes">Yes — fields missing</option>
        <option value="no">No</option>
      </Select>
    </Field>
  </div>

  <p class="signoff-note">
    By signing, the lead surgeon attests that the operation note above is a
    true contemporaneous record of the procedure performed and that the
    post-operative plan has been communicated to the recovery and ward teams.
  </p>
</Fieldset>
