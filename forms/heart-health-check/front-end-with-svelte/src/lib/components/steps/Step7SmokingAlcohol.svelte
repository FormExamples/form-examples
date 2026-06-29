<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import NumberInput from '$lib/components/ui/NumberInput.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import { isSmoker } from '$lib/engine/utils';

  const d = assessment.data.smokingAlcohol;
  const showCigarettes = $derived(isSmoker(d.smokingStatus));
  const showYearsSinceQuit = $derived(d.smokingStatus === 'exSmoker');
</script>

<Fieldset legend="Step 7 \u2014 Smoking and alcohol">
  <p class="hint">Tobacco and alcohol consumption.</p>

  <Field label="Smoking status" inputId="step-7-smokingStatus">
    <Select id="step-7-smokingStatus" label="Smoking status" bind:value={d.smokingStatus}>
      <option value="">\u2014 Select \u2014</option>
      <option value="nonSmoker">Non-smoker (never smoked)</option>
      <option value="exSmoker">Ex-smoker</option>
      <option value="lightSmoker">Light smoker (1\u20139/day)</option>
      <option value="moderateSmoker">Moderate smoker (10\u201319/day)</option>
      <option value="heavySmoker">Heavy smoker (20+/day)</option>
    </Select>
  </Field>

  {#if showCigarettes}
    <Field label="Cigarettes per day" inputId="step-7-cigarettesPerDay">
      <NumberInput
        id="step-7-cigarettesPerDay"
        label="Cigarettes per day"
        min={1}
        max={100}
        bind:value={d.cigarettesPerDay}
      />
    </Field>
  {/if}

  {#if showYearsSinceQuit}
    <Field label="Years since quitting" inputId="step-7-yearsSinceQuit">
      <NumberInput
        id="step-7-yearsSinceQuit"
        label="Years since quitting"
        min={0}
        max={80}
        bind:value={d.yearsSinceQuit}
      />
    </Field>
  {/if}

  <Field label="Alcohol units per week" inputId="step-7-alcoholUnitsPerWeek">
    <NumberInput
      id="step-7-alcoholUnitsPerWeek"
      label="Alcohol units per week"
      min={0}
      max={200}
      step="0.5"
      bind:value={d.alcoholUnitsPerWeek}
    />
  </Field>

  <Field label="Alcohol frequency" inputId="step-7-alcoholFrequency">
    <Select id="step-7-alcoholFrequency" label="Alcohol frequency" bind:value={d.alcoholFrequency}>
      <option value="">\u2014 Select \u2014</option>
      <option value="never">Never</option>
      <option value="monthly">Monthly or less</option>
      <option value="twoToFourPerMonth">2\u20134 times per month</option>
      <option value="twoToThreePerWeek">2\u20133 times per week</option>
      <option value="fourOrMorePerWeek">4+ times per week</option>
    </Select>
  </Field>
</Fieldset>
