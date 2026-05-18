<script lang="ts">
  import { store } from '$lib/stores/checklist.svelte.js';
  import type { ItemDef } from '$lib/config/items.js';
  import YesNoNa from './YesNoNa.svelte';

  let { item }: { item: ItemDef } = $props();
</script>

<div class="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-3 items-start py-2 border-b border-slate-100 last:border-b-0">
  <code class="text-xs text-slate-500 font-mono pt-1">{item.id}</code>
  <p class="text-sm text-slate-800">{item.text}</p>
  <YesNoNa name={item.id} bind:value={store.data.answers[item.id]} />
</div>
