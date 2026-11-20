<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';

  const a = assessment.data.application;
</script>

<Fieldset legend="Step 1 of 7 — Which application">
  <p class="hint">
    Choose the DVLA form that fits: V62 for a replacement V5C, or V55/4, V55/5, an import, or V627/1
    for a first registration.
  </p>

  <Field label="Application type" inputId="application-applicationType">
    <Select
      id="application-applicationType"
      label="Application type"
      bind:value={a.applicationType}
    >
      <option value="">— Select —</option>
      <option value="v62-replacement-v5c"
        >V62: replacement V5C (lost, stolen, destroyed, damaged, or not received)</option
      >
      <option value="v62-acquired-without-v5c">V62: vehicle acquired without a V5C</option>
      <option value="v55-4-new-vehicle">V55/4: first registration of a new vehicle</option>
      <option value="v55-5-used-vehicle">V55/5: first registration of a used vehicle</option>
      <option value="imported-vehicle">Imported vehicle (V55/4 new or V55/5 used)</option>
      <option value="v627-1-rebuilt-or-kit">V627/1: rebuilt or kit vehicle</option>
    </Select>
  </Field>
  <p class="hint">
    V55/4 is for new vehicles and V55/5 for used vehicles, including imports. V627/1 is for rebuilt
    or kit vehicles.
  </p>

  <Field label="Application date" inputId="application-applicationDate">
    <DateInput
      id="application-applicationDate"
      label="Application date"
      bind:value={a.applicationDate}
    />
  </Field>

  {#if a.applicationType === 'v62-replacement-v5c'}
    <Field label="Why do you need a replacement V5C?" inputId="application-v5cStatus">
      <Select
        id="application-v5cStatus"
        label="Why do you need a replacement V5C?"
        bind:value={a.v5cStatus}
      >
        <option value="">— Select —</option>
        <option value="lost">Lost</option>
        <option value="stolen">Stolen</option>
        <option value="destroyed">Destroyed</option>
        <option value="not-received">Not received after a change</option>
        <option value="damaged">Damaged</option>
      </Select>
    </Field>
  {/if}

  {#if a.applicationType === 'v62-replacement-v5c'}
    <Field label="Weeks since the change of keeper" inputId="application-weeksSinceChangeOfKeeper">
      <NumberInput
        id="application-weeksSinceChangeOfKeeper"
        label="Weeks since the change of keeper"
        min={0}
        max={520}
        bind:value={a.weeksSinceChangeOfKeeper}
      />
    </Field>
    <p class="hint">
      If the V5C has not arrived, contact the DVLA within 6 weeks to avoid the 25 pound fee.
    </p>
  {/if}

  {#if a.applicationType === 'v62-acquired-without-v5c'}
    <Field
      label="Is the green new-keeper slip from the most recent V5C enclosed?"
      inputId="application-newKeeperSlipProvided"
    >
      <Select
        id="application-newKeeperSlipProvided"
        label="Is the green new-keeper slip from the most recent V5C enclosed?"
        bind:value={a.newKeeperSlipProvided}
      >
        <option value="">— Select —</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <p class="hint">With the slip there is no fee; without it the V62 costs 25 pounds.</p>
  {/if}
</Fieldset>
