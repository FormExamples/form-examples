<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  let {
    items = $bindable(),
    title,
    addLabel = 'Add',
    max,
    create,
    children,
  }: {
    items: T[];
    title: string;
    addLabel?: string;
    max: number;
    create: () => T;
    children: Snippet<[T, number]>;
  } = $props();

  function add() {
    if (items.length < max) items = [...items, create()];
  }
  function remove(i: number) {
    items = items.filter((_, j) => j !== i);
  }
</script>

<section class="mb-6">
  <header class="flex items-center justify-between mb-2">
    <h3 class="text-md font-semibold text-slate-700">{title}</h3>
    <button type="button"
            class="text-sm px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 disabled:opacity-50"
            disabled={items.length >= max}
            onclick={add}>
      {addLabel} ({items.length}/{max})
    </button>
  </header>
  {#each items as item, i (i)}
    <div class="border border-slate-200 rounded p-3 mb-2">
      {@render children(item, i)}
      <button type="button" class="text-xs text-red-600 mt-2" onclick={() => remove(i)}>Remove</button>
    </div>
  {/each}
</section>
