<script lang="ts">
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import ItemRow from '#lib/components/ui/ItemRow.svelte';
  import { itemsForSection } from '#lib/config/items.js';

  const items = itemsForSection(10);

  // Group consecutively by subsection (e.g. Diagnostic Facility's 6.1 Pathology
  // Lab / 6.2 Radio Imaging); sections with no subsections render one group.
  const groups: { subsection?: string; items: typeof items }[] = [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    if (last && last.subsection === item.subsection) {
      last.items.push(item);
    } else {
      groups.push({ subsection: item.subsection, items: [item] });
    }
  }
</script>

<Fieldset legend="Step 11 — Section 10 — Wards (5 checkpoints)">
  <p class="hint">Ward mattress/sheets/drugs, clinician rounds, record keeping, staffing, and patient feedback.</p>

  {#each groups as group, gi (gi)}
    {#if group.subsection}
      <h3 class="subsection-heading">{group.subsection}</h3>
    {/if}
    {#each group.items as item (item.id)}
      <ItemRow {item} />
    {/each}
  {/each}
</Fieldset>

<style>
  .subsection-heading {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 1rem 0 0.25rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--color-border);
  }
  .subsection-heading:first-child {
    margin-top: 0;
    padding-top: 0;
    border-top: 0;
  }
</style>
