<script lang="ts">
  import type { Objective } from '$data/sample';
  let { obj, onClose }: { obj: Objective | null; onClose: () => void } = $props();
</script>

{#if obj}
  <aside class="w-96 p-4 border-l bg-white overflow-y-auto">
    <header class="flex justify-between items-start mb-3">
      <h2 class="font-bold text-lg">{obj.obj_title}</h2>
      <button class="text-gray-500" onclick={onClose} data-test="btn-close">×</button>
    </header>
    <p class="text-sm text-gray-600 mb-3">{obj.level} • {obj.cycle} • DRI: {obj.dri || '(none)'}</p>

    <h3 class="font-semibold mt-3">Key Results</h3>
    <ul class="space-y-2">
      {#each obj.keyResults as k (k.position)}
        <li class="border rounded p-2">
          <div class="text-sm font-medium">{k.position}. {k.title}</div>
          <div class="text-xs text-gray-600">{k.current ?? '–'}/{k.target ?? '–'} {k.unit}</div>
          <div class="h-1.5 mt-1 bg-gray-200 rounded">
            <div class="h-1.5 bg-blue-600 rounded" style:width="{Math.round((k.progress_fraction ?? 0) * 100)}%"></div>
          </div>
        </li>
      {/each}
    </ul>

    <h3 class="font-semibold mt-3">Flags ({obj.flags.length})</h3>
    {#if obj.flags.length === 0}<p class="text-sm text-gray-500">none</p>{/if}
    <ul class="space-y-1">
      {#each obj.flags as f (f.code)}
        <li class="text-sm"><b>{f.code}</b> [{f.priority}]: {f.description}</li>
      {/each}
    </ul>

    {#if obj.latestCheckIn}
      <h3 class="font-semibold mt-3">Latest check-in</h3>
      <p class="text-xs text-gray-600">{obj.latestCheckIn.checked_in_at.slice(0, 10)}</p>
      <p class="text-sm">{obj.latestCheckIn.narrative}</p>
    {/if}
  </aside>
{/if}
