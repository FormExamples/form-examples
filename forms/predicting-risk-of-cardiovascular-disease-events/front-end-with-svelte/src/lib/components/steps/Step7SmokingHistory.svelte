<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';

  const sh = assessment.data.smokingHistory;
</script>

<Fieldset legend="Step 7 \u2014 Smoking history">
  <p class="hint">Smoking status is a major modifiable CVD risk factor.</p>

  <Field label="Smoking status" inputId="step-7-smokingStatus" required>
    <Select id="step-7-smokingStatus" label="Smoking status" bind:value={sh.smokingStatus}>
      <option value="">\u2014 Select \u2014</option>
      <option value="never">Never smoked</option>
      <option value="current">Current smoker</option>
      <option value="former">Former smoker</option>
    </Select>
  </Field>

  {#if sh.smokingStatus === 'current' || sh.smokingStatus === 'former'}
    <Field label="Years smoked" inputId="step-7-yearsSmoked">
      <NumberInput id="step-7-yearsSmoked" label="Years smoked" min={1} max={80} bind:value={sh.yearsSmoked} />
    </Field>
  {/if}

  {#if sh.smokingStatus === 'current'}
    <Field label="Cigarettes per day" inputId="step-7-cigarettesPerDay">
      <NumberInput
        id="step-7-cigarettesPerDay"
        label="Cigarettes per day"
        min={1}
        max={100}
        bind:value={sh.cigarettesPerDay}
      />
    </Field>
  {/if}

  {#if sh.smokingStatus === 'former'}
    <Field label="Years since quit" inputId="step-7-yearsSinceQuit">
      <NumberInput
        id="step-7-yearsSinceQuit"
        label="Years since quit"
        min={0}
        max={80}
        bind:value={sh.yearsSinceQuit}
      />
    </Field>
  {/if}
</Fieldset>
