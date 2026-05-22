<script lang="ts">
  import { store } from '$lib/stores/lpa.svelte.js';
  import PersonCard from '$lib/components/ui/PersonCard.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 6 &mdash; People to notify (LP1F section 6)</h2>
  <p class="text-sm text-slate-600 mb-3">
    Up to 5 people who will be notified when the OPG is asked to register the LPA. They can object
    if they have concerns. People-to-notify cannot also be attorneys.
  </p>

  <div class="space-y-4">
    {#each store.data.peopleToNotify as p, i (p.person.id)}
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-slate-700">Person to notify #{p.ordinal}</h3>
          <button
            type="button"
            class="text-xs text-red-700 hover:underline"
            onclick={() => store.removePersonToNotify(i)}
          >
            Remove
          </button>
        </div>
        <PersonCard bind:person={store.data.peopleToNotify[i].person} showEmail={false} />
      </div>
    {/each}
  </div>

  {#if store.data.peopleToNotify.length < 5}
    <button
      type="button"
      class="mt-4 px-3 py-2 rounded bg-brand-600 text-white text-sm hover:bg-brand-700"
      onclick={() => store.addPersonToNotify()}
    >
      Add person to notify
    </button>
  {:else}
    <p class="mt-2 text-xs text-slate-500">Maximum of 5 people to notify reached.</p>
  {/if}
</section>
