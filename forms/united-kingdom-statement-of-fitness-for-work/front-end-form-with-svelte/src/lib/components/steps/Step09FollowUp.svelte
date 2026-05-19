<script lang="ts">
  import Field from '$lib/components/ui/Field.svelte';
  import YesNoToggle from '$lib/components/ui/YesNoToggle.svelte';
  import { store } from '$lib/store.svelte.js';
</script>

<section aria-labelledby="step9-heading">
  <h2 id="step9-heading" class="text-xl font-semibold mb-4">Step 9 — Follow-up</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Field id="will-assess-again" label="Will assess again at end of period?">
      <YesNoToggle
        id="will-assess-again"
        name="willAssessAgain"
        bind:value={store.data.willAssessAgain}
      />
    </Field>
    <Field id="planned-review-date" label="Planned review date">
      <input
        id="planned-review-date"
        type="date"
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.plannedReviewDate}
      />
    </Field>
  </div>
</section>
