<script lang="ts">
  import SelectField from '#lib/components/ui/SelectField.svelte';
  import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
  import YesNoField from '#lib/components/ui/YesNoField.svelte';
  import { lpaStore } from '#lib/stores/lpa.svelte.js';

  const instructions = $derived(lpaStore.application.instructions);
  function changed() {
    lpaStore.recompute();
  }
  function add() {
    instructions.push({
      category: '',
      statement: '',
      lawfulnessAssessed: '',
      contradictsAdrt: '',
    });
    changed();
  }
  function remove(i: number) {
    instructions.splice(i, 1);
    changed();
  }

  const CATEGORIES = [
    { value: 'medical-treatment-limit', label: 'Medical treatment limit' },
    { value: 'residence-restriction', label: 'Residence restriction' },
    { value: 'contact-restriction', label: 'Contact restriction' },
    { value: 'religion-and-belief', label: 'Religion and belief' },
    { value: 'food-and-drink', label: 'Food and drink' },
    { value: 'end-of-life-care', label: 'End-of-life care' },
    { value: 'other', label: 'Other' },
  ];
</script>

<div class="space-y-4">
  <p class="text-sm text-base-content/80">
    Instructions are <strong>binding</strong>. Attorneys must follow them. Instructions must
    be lawful, possible, and consistent with any Advance Decision to Refuse Treatment.
  </p>

  {#each instructions as ins, i (i)}
    <section class="space-y-3 rounded-lg border border-base-300 bg-base-200 p-4">
      <header class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-base-content">Instruction #{i + 1}</h3>
        <button type="button" onclick={() => remove(i)} class="text-sm text-error hover:underline">
          Remove
        </button>
      </header>
      <SelectField label="Category" bind:value={ins.category} options={CATEGORIES} onchange={changed} />
      <TextAreaInput label="Statement" bind:value={ins.statement} rows={3} onchange={changed} />
      <YesNoField
        label="Lawfulness assessed by solicitor or certificate provider?"
        bind:value={ins.lawfulnessAssessed}
        onchange={changed}
      />
      <YesNoField
        label="Does this contradict a known ADRT?"
        bind:value={ins.contradictsAdrt}
        hint="If yes, R-MCA-INSTR-ADRT fires."
        onchange={changed}
      />
    </section>
  {/each}

  <button
    type="button"
    onclick={add}
    class="rounded border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
  >
    + Add instruction
  </button>
</div>
