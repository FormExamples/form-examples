<script lang="ts">
  import { store } from '$lib/stores/adr.svelte.js';

  let pendingNotedBy = $state('');
  let pendingBody = $state('');

  function add() {
    if (!pendingBody.trim()) return;
    store.addNote(pendingNotedBy, pendingBody);
    pendingNotedBy = '';
    pendingBody = '';
  }
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 15 — Notes</h2>
  <p class="text-sm text-base-content/70 mb-4">
    Tyree &amp; Akerman §14: discussion log captured during socialisation.
    Append-only; each note is timestamped.
  </p>

  <div class="grid gap-2 mb-4">
    {#if store.data.notes.length === 0}
      <p class="text-sm text-base-content/60 italic">No notes yet. Add one as you socialise the decision.</p>
    {/if}
    {#each store.data.notes as note, i (i)}
      <div class="border-l-4 border-primary bg-base-200 p-2 rounded">
        <div class="text-xs text-base-content/70">{note.notedAt} — {note.notedBy || 'unknown'}</div>
        <div class="text-sm whitespace-pre-wrap">{note.body}</div>
        <button
          type="button"
          class="mt-1 text-xs text-error underline"
          onclick={() => store.removeNote(i)}
        >
          Remove
        </button>
      </div>
    {/each}
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    <label class="block">
      <span class="text-sm text-base-content">Noted by</span>
      <input type="text" class="w-full border rounded px-2 py-1" bind:value={pendingNotedBy} />
    </label>
    <label class="block">
      <span class="text-sm text-base-content">Body</span>
      <textarea class="w-full border rounded px-2 py-1 font-mono text-sm" rows="2" bind:value={pendingBody}></textarea>
    </label>
  </div>
  <button
    type="button"
    class="mt-2 text-sm px-3 py-1.5 rounded bg-success/10 text-success border border-success/30"
    onclick={add}
  >
    + Add note
  </button>
</section>
