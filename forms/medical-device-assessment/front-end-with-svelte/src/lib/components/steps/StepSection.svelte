<script lang="ts">
  // StepSection -- one wizard step: a Lily Fieldset with the step's
  // description followed by its declarative fields (and optional extras).
  import type { Snippet } from 'svelte';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import { TOTAL_STEPS } from '#lib/config/steps.js';
  import type { StepDef } from '#lib/engine/types.js';
  import FieldRenderer from './FieldRenderer.svelte';

  let { def, children }: { def: StepDef; children?: Snippet } = $props();
</script>

<Fieldset legend={`Step ${def.step} of ${TOTAL_STEPS} — ${def.title}`}>
  <p class="mb-4 text-sm text-base-content/70">{def.description}</p>
  {@render children?.()}
  <div class="grid gap-4 sm:grid-cols-2">
    {#each def.fields as field (field.path)}
      <FieldRenderer {field} />
    {/each}
  </div>
</Fieldset>
