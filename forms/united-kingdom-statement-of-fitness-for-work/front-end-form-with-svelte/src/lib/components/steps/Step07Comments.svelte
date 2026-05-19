<script lang="ts">
  import Field from '$lib/components/ui/Field.svelte';
  import TextArea from '$lib/components/ui/TextArea.svelte';
  import { store } from '$lib/store.svelte.js';
</script>

<section aria-labelledby="step7-heading">
  <h2 id="step7-heading" class="text-xl font-semibold mb-4">Step 7 — Comments</h2>
  <p class="text-sm text-slate-600 mb-3">
    DWP policy 5.6: describe the functional impact and offer practical, work-focused
    advice. Avoid medical jargon. Do not record personal opinions.
  </p>
  <Field id="comments" label="Comments / functional advice">
    <TextArea
      id="comments"
      name="comments"
      rows={6}
      placeholder="Avoid lifting > 5 kg. Desk-based duties only for first three weeks."
      bind:value={store.data.comments}
    />
  </Field>
</section>
