<script lang="ts">
  import SelectField from '$lib/components/ui/SelectField.svelte';
  import { lpaStore } from '$lib/stores/lpa.svelte.js';

  const app = $derived(lpaStore.application);
  function changed() {
    lpaStore.recompute();
  }
</script>

<div class="space-y-4">
  <div class="rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
    <strong>Important:</strong> a Health and Welfare LPA can only be used after registration
    with the Office of the Public Guardian <em>and</em> after the donor has lost the capacity
    to make a particular decision (MCA 2005 s.11(7)).
  </div>

  <SelectField
    label="LPA jurisdiction"
    required
    bind:value={app.jurisdiction}
    onchange={changed}
    options={[
      { value: 'england', label: 'England' },
      { value: 'wales', label: 'Wales' },
    ]}
    hint="Scotland and Northern Ireland use separate schemes."
  />
</div>
