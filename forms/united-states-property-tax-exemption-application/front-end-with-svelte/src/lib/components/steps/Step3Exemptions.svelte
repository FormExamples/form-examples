<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const s = assessment.data.exemptions;
</script>

<Fieldset legend="Step 3 of 8 — Exemptions claimed">
  <p class="hint">
    The homestead exemption and any related relief. Each is tested against the state rule.
  </p>

  <Field label="General homestead exemption" inputId="exemptions-claimHomestead">
    <Select
      id="exemptions-claimHomestead"
      label="General homestead exemption"
      bind:value={s.claimHomestead}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Senior (age-based) exemption or relief" inputId="exemptions-claimSenior">
    <Select
      id="exemptions-claimSenior"
      label="Senior (age-based) exemption or relief"
      bind:value={s.claimSenior}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Disability exemption" inputId="exemptions-claimDisability">
    <Select
      id="exemptions-claimDisability"
      label="Disability exemption"
      bind:value={s.claimDisability}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  <Field label="Disabled-veteran exemption" inputId="exemptions-claimVeteran">
    <Select
      id="exemptions-claimVeteran"
      label="Disabled-veteran exemption"
      bind:value={s.claimVeteran}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  {#if s.claimVeteran === 'yes'}
    <Field
      label="VA service-connected disability rating (%)"
      inputId="exemptions-veteranDisabilityPercent"
    >
      <NumberInput
        id="exemptions-veteranDisabilityPercent"
        label="VA service-connected disability rating (%)"
        bind:value={s.veteranDisabilityPercent}
      />
    </Field>
  {/if}

  <Field
    label="Circuit-breaker (income-based) property tax relief"
    inputId="exemptions-claimCircuitBreaker"
  >
    <Select
      id="exemptions-claimCircuitBreaker"
      label="Circuit-breaker (income-based) property tax relief"
      bind:value={s.claimCircuitBreaker}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
</Fieldset>
