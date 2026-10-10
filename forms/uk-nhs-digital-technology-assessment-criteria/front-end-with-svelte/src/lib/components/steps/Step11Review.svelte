<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import { SECTIONS } from '#lib/engine/criteria.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import FlagBanner from '#lib/components/ui/FlagBanner.svelte';
  import { TextAreaInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';

  const r = $derived(store.result);
</script>

<Fieldset legend="Step 11 — Review and outcome">
  <p class="text-sm">
    Computed outcome: <strong>{r.outcomeLabel}</strong> — mandatory {r.mandatoryMet}/{r.mandatoryTotal} met,
    advisory {r.advisoryMet}/{r.advisoryTotal} met.
  </p>
  <ul class="text-sm">
    {#each SECTIONS as s (s.id)}
      <li>Section {s.id.toUpperCase()} — {s.title}: <strong>{r.sections[s.id]}</strong></li>
    {/each}
  </ul>
  <FlagBanner flags={r.flags} outcome={r.outcome} />
  <div class="field-grid">
    <Field label="Final outcome (assessor sign-off)">
      <Select label="Final outcome" bind:value={store.data.assessment.finalOutcome}>
        <option value="">Same as computed outcome</option>
        <option value="meets">Meets the criteria</option>
        <option value="conditional">Meets with conditions</option>
        <option value="does-not-meet">Does not meet the criteria</option>
        <option value="incomplete">Incomplete</option>
      </Select>
    </Field>
    <Field
      label="Override reason"
      class="field-span-2"
      inputId="step-11-override-reason"
      error={store.errors['step-11-override-reason']}
    >
      <TextAreaInput
        id="step-11-override-reason"
        label="Override reason"
        rows={3}
        bind:value={store.data.assessment.assessorOverrideReason}
        aria-invalid={store.errors['step-11-override-reason'] ? 'true' : undefined}
      />
    </Field>
  </div>
</Fieldset>
