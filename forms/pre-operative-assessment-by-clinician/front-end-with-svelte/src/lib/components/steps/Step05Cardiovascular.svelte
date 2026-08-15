<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import NumberInput from '#lib/components/ui/NumberInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';

  const yn = ['', 'yes', 'no'] as const;
  const rcri = [
    ['historyIhd', 'History IHD'],
    ['historyChf', 'History CHF'],
    ['historyStrokeTia', 'History stroke/TIA'],
    ['recentMiWithin3Months', 'Recent MI < 3 months'],
    ['pacemakerOrIcd', 'Pacemaker/ICD'],
    ['activeAngina', 'Active angina'],
  ] as const;
</script>

<Fieldset legend="Step 5 — Cardiovascular">
  <div class="field-grid">
    <Field label="Rhythm">
      <Select label="Rhythm" bind:value={store.data.cardiovascular.heartRhythm}>
        <option value="">—</option>
        <option value="sinus">Sinus</option>
        <option value="atrial-fibrillation">Atrial fibrillation</option>
        <option value="flutter">Flutter</option>
        <option value="heart-block">Heart block</option>
        <option value="paced">Paced</option>
        <option value="other">Other</option>
      </Select>
    </Field>
    <Field label="Murmur">
      <Select label="Murmur" bind:value={store.data.cardiovascular.murmurPresent}>
        {#each yn as v}<option value={v}>{v || '—'}</option>{/each}
      </Select>
    </Field>
    <Field label="Echo EF (%)">
      <NumberInput label="Echo EF (%)" bind:value={store.data.cardiovascular.echoEfPercent} />
    </Field>
    <Field label="ECG ischaemic changes">
      <Select label="ECG ischaemic changes" bind:value={store.data.cardiovascular.ecgIschaemicChanges}>
        {#each yn as v}<option value={v}>{v || '—'}</option>{/each}
      </Select>
    </Field>
  </div>

  <h3 class="step-subhead">RCRI cardiac history</h3>
  <div class="field-grid field-grid-3">
    {#each rcri as [key, label]}
      <Field {label}>
        <Select {label} bind:value={store.data.cardiovascular[key]}>
          {#each yn as v}<option value={v}>{v || '—'}</option>{/each}
        </Select>
      </Field>
    {/each}
  </div>
</Fieldset>
