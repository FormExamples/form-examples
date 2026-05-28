<script lang="ts" generics="T">
  // RepeatList — Lily Svelte headless contract.
  // Emits a fieldset section with button (data-variant="add") for items.
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

<fieldset class="fieldset">
  <legend class="fieldset-legend">{title}</legend>
  <div class="button-group">
    <button
      type="button"
      class="button"
      data-variant="add"
      disabled={items.length >= max}
      onclick={add}
    >
      {addLabel} ({items.length}/{max})
    </button>
  </div>
  {#each items as item, i (i)}
    <div class="field">
      {@render children(item, i)}
      <button
        type="button"
        class="button"
        data-variant="remove"
        onclick={() => remove(i)}
      >
        Remove
      </button>
    </div>
  {/each}
</fieldset>
