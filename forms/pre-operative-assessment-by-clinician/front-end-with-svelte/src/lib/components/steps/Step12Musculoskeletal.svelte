<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';

  const rom = ['', 'full', 'reduced', 'severely-limited'] as const;
</script>

<Fieldset legend="Step 12 — Musculoskeletal and skin">
  <div class="field-grid">
    <Field label="Spine exam">
      <Select label="Spine exam" bind:value={store.data.musculoskeletal.spineExam}>
        <option value="">—</option>
        <option value="normal">Normal</option>
        <option value="scoliosis">Scoliosis</option>
        <option value="kyphosis">Kyphosis</option>
        <option value="previous-surgery">Previous surgery</option>
        <option value="ankylosing-spondylitis">Ankylosing spondylitis</option>
      </Select>
    </Field>
    <Field label="Neuraxial suitable">
      <Select label="Neuraxial suitable" bind:value={store.data.musculoskeletal.neuraxialSuitable}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
        <option value="unsure">Unsure</option>
      </Select>
    </Field>
    <Field label="Hip ROM">
      <Select label="Hip ROM" bind:value={store.data.musculoskeletal.jointRomHip}>
        {#each rom as v}<option value={v}>{v || '—'}</option>{/each}
      </Select>
    </Field>
    <Field label="Shoulder ROM">
      <Select label="Shoulder ROM" bind:value={store.data.musculoskeletal.jointRomShoulder}>
        {#each rom as v}<option value={v}>{v || '—'}</option>{/each}
      </Select>
    </Field>
    <Field label="Neck ROM">
      <Select label="Neck ROM" bind:value={store.data.musculoskeletal.jointRomNeck}>
        {#each rom as v}<option value={v}>{v || '—'}</option>{/each}
      </Select>
    </Field>
    <Field label="Pressure ulcer risk">
      <Select label="Pressure ulcer risk" bind:value={store.data.musculoskeletal.pressureUlcerRisk}>
        <option value="">—</option>
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
        <option value="very-high">Very high</option>
      </Select>
    </Field>
  </div>
</Fieldset>
