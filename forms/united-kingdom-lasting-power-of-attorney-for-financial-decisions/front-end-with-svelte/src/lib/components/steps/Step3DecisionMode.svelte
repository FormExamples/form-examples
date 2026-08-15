<script lang="ts">
  import { store } from '#lib/stores/lpa.svelte.js';
  import Field from '#lib/components/ui/Field.svelte';
  import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
  import TextareaInput from '#lib/components/ui/TextareaInput.svelte';

  const options = [
    { value: 'single_attorney', label: 'Single attorney (only one attorney appointed)' },
    {
      value: 'jointly_and_severally',
      label: 'Jointly and severally (attorneys can act together or independently)',
    },
    { value: 'jointly', label: 'Jointly (attorneys must always act together)' },
    {
      value: 'mixed',
      label: 'Jointly for some decisions, jointly and severally for others (mixed)',
    },
  ];
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 3 &mdash; How attorneys make decisions (LP1F section 3)</h2>
  <p class="text-sm text-base-content/70 mb-3">
    Choose how the attorneys must act. &ldquo;Jointly&rdquo; means the LPA fails if any attorney drops
    out unless you have a replacement. &ldquo;Mixed&rdquo; requires LPC continuation sheet 2 listing
    which decisions are joint.
  </p>
  <RadioGroup name="decisionMode" {options} bind:value={store.data.decisionMode} />
  {#if store.data.decisionMode === 'mixed'}
    <div class="mt-3">
      <Field label="Which decisions are joint?" hint="Brief summary; long lists continue on LPC sheet 2.">
        <TextareaInput bind:value={store.data.decisionModeMixedText} rows={4} maxlength={2000} />
      </Field>
    </div>
  {/if}
</section>
