<script lang="ts">
  import RagChip from './RagChip.svelte';
  import type { Objective } from '$data/sample';

  let {
    data,
    onSelect,
    selectedId,
  }: {
    data: Objective[];
    onSelect: (id: string) => void;
    selectedId: string | null;
  } = $props();

  type ColumnId =
    | 'obj_title' | 'level' | 'dri' | 'cycle' | 'rag'
    | 'progress_percent' | 'confidence_decile' | 'kr_count'
    | 'flag_count' | 'last_check_in_at';

  const columns: { id: ColumnId; header: string; width?: string }[] = [
    { id: 'obj_title', header: 'Title' },
    { id: 'level', header: 'Level', width: '6rem' },
    { id: 'dri', header: 'DRI', width: '8rem' },
    { id: 'cycle', header: 'Cycle', width: '6rem' },
    { id: 'rag', header: 'RAG', width: '5rem' },
    { id: 'progress_percent', header: 'Progress', width: '6rem' },
    { id: 'confidence_decile', header: 'Conf', width: '5rem' },
    { id: 'kr_count', header: '# KRs', width: '5rem' },
    { id: 'flag_count', header: '# flags', width: '5rem' },
    { id: 'last_check_in_at', header: 'Last check-in', width: '7rem' },
  ];

  let sortKey: ColumnId | null = $state(null);
  let sortDir: 'asc' | 'desc' = $state('asc');

  function getValue(d: Objective, k: ColumnId): string | number {
    switch (k) {
      case 'kr_count': return d.keyResults.length;
      case 'flag_count': return d.flags.length;
      case 'last_check_in_at': return d.latestCheckIn?.checked_in_at ?? '';
      case 'cycle': return d.cycle_start_date;
      default: return d[k as keyof Objective] as string | number;
    }
  }

  const sortedData = $derived.by(() => {
    if (!sortKey) return data;
    const k = sortKey;
    return [...data].sort((a, b) => {
      const av = getValue(a, k);
      const bv = getValue(b, k);
      const cmp = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  });

  function toggleSort(k: ColumnId) {
    if (sortKey === k) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    else { sortKey = k; sortDir = 'asc'; }
  }
</script>

<table class="w-full text-sm border bg-white">
  <thead class="bg-stone-100">
    <tr>
      {#each columns as col (col.id)}
        <th
          class="text-left p-2 cursor-pointer select-none"
          style:width={col.width ?? ''}
          data-sort={col.id}
          data-sort-dir={sortKey === col.id ? sortDir : ''}
          onclick={() => toggleSort(col.id)}
        >
          {col.header}{sortKey === col.id ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''}
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each sortedData as d (d.id)}
      <tr
        data-grid-row
        data-id={d.id}
        class="border-t hover:bg-yellow-50 cursor-pointer"
        class:bg-yellow-100={selectedId === d.id}
        onclick={() => onSelect(d.id)}
      >
        <td class="p-2">{d.obj_title}</td>
        <td class="p-2">{d.level}</td>
        <td class="p-2">{d.dri || '—'}</td>
        <td class="p-2">{d.cycle}</td>
        <td class="p-2"><RagChip value={d.rag} /></td>
        <td class="p-2">{d.progress_percent}%</td>
        <td class="p-2">{d.confidence_decile}/10</td>
        <td class="p-2">{d.keyResults.length}</td>
        <td class="p-2">{d.flags.length}</td>
        <td class="p-2">{d.latestCheckIn?.checked_in_at?.slice(0, 10) ?? ''}</td>
      </tr>
    {/each}
  </tbody>
</table>
