<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import NumberInput from '$lib/components/ui/NumberInput.svelte';
  import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

  const s = assessment.data.smokingHistory;
</script>

<Fieldset legend="Step 3 \u2014 Smoking history">
  <p class="hint">Smoking status is a key factor in the Framingham risk calculation.</p>

  <Field label="Current smoking status">
    <RadioGroup label="Current smoking status">
      <label class="radio-input">
        <input type="radio" name="smokingStatus" value="current" bind:group={s.smokingStatus} /> Current smoker
      </label>
      <label class="radio-input">
        <input type="radio" name="smokingStatus" value="former" bind:group={s.smokingStatus} /> Former smoker
      </label>
      <label class="radio-input">
        <input type="radio" name="smokingStatus" value="never" bind:group={s.smokingStatus} /> Never smoked
      </label>
    </RadioGroup>
  </Field>

  <div class="field-grid">
    <Field label="Cigarettes per day" inputId="step-3-cigarettesPerDay">
      <NumberInput
        id="step-3-cigarettesPerDay"
        label="Cigarettes per day"
        min={0}
        max={100}
        bind:value={s.cigarettesPerDay}
      />
    </Field>
    <Field label="Years smoked" inputId="step-3-yearsSmoked">
      <NumberInput
        id="step-3-yearsSmoked"
        label="Years smoked"
        min={0}
        max={100}
        bind:value={s.yearsSmoked}
      />
    </Field>
  </div>

  <Field label="Years since quitting (if former smoker)" inputId="step-3-yearsSinceQuit">
    <NumberInput
      id="step-3-yearsSinceQuit"
      label="Years since quitting"
      min={0}
      max={100}
      bind:value={s.yearsSinceQuit}
    />
  </Field>
</Fieldset>
