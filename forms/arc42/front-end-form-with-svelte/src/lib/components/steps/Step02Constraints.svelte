<script lang="ts">
  import { store } from '$lib/stores/documentation.svelte.js';
  import type { ConstraintItem } from '$lib/grading/types.js';

  // Helpers for partitioned sections — each adds to the shared constraintItems array
  const MAX_TECHNICAL = 8;
  const MAX_ORGANIZATIONAL = 5;
  const MAX_CONVENTION = 8;

  function technicalItems() {
    return store.data.constraintItems.filter((c) => c.kind === 'technical');
  }
  function organizationalItems() {
    return store.data.constraintItems.filter((c) => c.kind === 'organizational');
  }
  function conventionItems() {
    return store.data.constraintItems.filter((c) => c.kind === 'convention');
  }

  function addConstraint(kind: ConstraintItem['kind']) {
    const ordinal = store.data.constraintItems.length + 1;
    store.data.constraintItems = [
      ...store.data.constraintItems,
      { ordinal, kind, name: '', description: '' },
    ];
  }

  function removeConstraintWhere(kind: ConstraintItem['kind'], indexInKind: number) {
    let count = 0;
    store.data.constraintItems = store.data.constraintItems.filter((c) => {
      if (c.kind !== kind) return true;
      return count++ !== indexInKind;
    });
  }
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 2 — Constraints</h2>

  <!-- Technical constraints -->
  <div class="mb-6">
    <header class="flex items-center justify-between mb-2">
      <h3 class="text-md font-semibold text-slate-700">Technical constraints (max {MAX_TECHNICAL})</h3>
      <button type="button"
              class="text-sm px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-50"
              disabled={technicalItems().length >= MAX_TECHNICAL}
              onclick={() => addConstraint('technical')}>
        Add ({technicalItems().length}/{MAX_TECHNICAL})
      </button>
    </header>
    {#each technicalItems() as item, i (i)}
      <div class="border border-slate-200 rounded p-3 mb-2">
        <input type="text" placeholder="Name" class="w-full border rounded px-2 py-1 mb-1" bind:value={item.name} />
        <textarea rows="2" placeholder="Description" class="w-full border rounded px-2 py-1" bind:value={item.description}></textarea>
        <button type="button" class="text-xs text-red-600 mt-2" onclick={() => removeConstraintWhere('technical', i)}>Remove</button>
      </div>
    {/each}
  </div>

  <!-- Organizational constraints -->
  <div class="mb-6">
    <header class="flex items-center justify-between mb-2">
      <h3 class="text-md font-semibold text-slate-700">Organizational constraints (max {MAX_ORGANIZATIONAL})</h3>
      <button type="button"
              class="text-sm px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-50"
              disabled={organizationalItems().length >= MAX_ORGANIZATIONAL}
              onclick={() => addConstraint('organizational')}>
        Add ({organizationalItems().length}/{MAX_ORGANIZATIONAL})
      </button>
    </header>
    {#each organizationalItems() as item, i (i)}
      <div class="border border-slate-200 rounded p-3 mb-2">
        <input type="text" placeholder="Name" class="w-full border rounded px-2 py-1 mb-1" bind:value={item.name} />
        <textarea rows="2" placeholder="Description" class="w-full border rounded px-2 py-1" bind:value={item.description}></textarea>
        <button type="button" class="text-xs text-red-600 mt-2" onclick={() => removeConstraintWhere('organizational', i)}>Remove</button>
      </div>
    {/each}
  </div>

  <!-- Conventions -->
  <div class="mb-6">
    <header class="flex items-center justify-between mb-2">
      <h3 class="text-md font-semibold text-slate-700">Conventions (max {MAX_CONVENTION})</h3>
      <button type="button"
              class="text-sm px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-50"
              disabled={conventionItems().length >= MAX_CONVENTION}
              onclick={() => addConstraint('convention')}>
        Add ({conventionItems().length}/{MAX_CONVENTION})
      </button>
    </header>
    {#each conventionItems() as item, i (i)}
      <div class="border border-slate-200 rounded p-3 mb-2">
        <input type="text" placeholder="Topic" class="w-full border rounded px-2 py-1 mb-1" bind:value={item.name} />
        <textarea rows="2" placeholder="Description" class="w-full border rounded px-2 py-1" bind:value={item.description}></textarea>
        <button type="button" class="text-xs text-red-600 mt-2" onclick={() => removeConstraintWhere('convention', i)}>Remove</button>
      </div>
    {/each}
  </div>
</section>
