<script lang="ts">
  import { store } from '#lib/stores/lpa.svelte.js';
  import PersonCard from '#lib/components/ui/PersonCard.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextareaInput from '#lib/components/ui/TextareaInput.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 4 &mdash; Replacement attorneys (LP1F section 4)</h2>
  <p class="text-sm text-base-content/70 mb-3">
    Zero or more people who step in if an original attorney can no longer act. Strongly
    recommended when attorneys are appointed jointly. Optional &ldquo;when and how&rdquo; override
    continues on LPC sheet 2 if long.
  </p>

  <div class="space-y-4">
    {#each store.data.replacementAttorneys as r, i (r.person.id)}
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-base-content/80">Replacement #{r.ordinal}</h3>
          <button
            type="button"
            class="text-xs text-error hover:underline"
            onclick={() => store.removeReplacementAttorney(i)}
          >
            Remove
          </button>
        </div>
        <PersonCard
          bind:person={store.data.replacementAttorneys[i].person}
          showBankruptcyFlags
        />
        <Field label="Step-in condition (optional)" hint="When and how this replacement takes over.">
          <TextareaInput
            bind:value={store.data.replacementAttorneys[i].replacementStepInCondition}
            rows={2}
            maxlength={500}
          />
        </Field>
      </div>
    {/each}
  </div>

  <button
    type="button"
    class="mt-4 px-3 py-2 rounded bg-primary text-primary-content text-sm hover:bg-primary"
    onclick={() => store.addReplacementAttorney()}
  >
    Add replacement attorney
  </button>
</section>
