<script lang="ts">
  import { store } from '$lib/stores/lpa.svelte.js';
  import Field from '$lib/components/ui/Field.svelte';
  import TextareaInput from '$lib/components/ui/TextareaInput.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 7 &mdash; Preferences and instructions (LP1F section 7)</h2>
  <p class="text-sm text-slate-600 mb-3">
    Preferences are non-binding guidance. Instructions are legally binding on the attorneys.
    Long or complex instructions risk OPG rejection \u2014 keep them clear and concrete.
  </p>
  <div class="space-y-4">
    <Field label="Preferences (optional, non-binding)">
      <TextareaInput bind:value={store.data.preferencesText} rows={5} maxlength={2000} />
    </Field>
    <Field label="Instructions (legally binding)">
      <TextareaInput bind:value={store.data.instructionsText} rows={5} maxlength={2000} />
    </Field>
  </div>
</section>
