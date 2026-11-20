<script lang="ts">
    // Test host: a RepeatableFieldset of medicines, each a labelled text field, with the items shown for a test to read.
    import { untrack } from "svelte";
    import RepeatableFieldset from "./RepeatableFieldset.svelte";

    let {
        initial = [],
        min = 0,
        max = undefined,
    }: { initial?: { name: string }[]; min?: number; max?: number } = $props();
    // The host starts from the first items only; later changes come from the component.
    let items = $state(untrack(() => initial.map((x) => ({ ...x }))));
</script>

<RepeatableFieldset
    legend="Medicines"
    bind:items
    newItem={() => ({ name: "" })}
    itemLegend={(n) => `Medicine ${n}`}
    addLabel="Add another medicine"
    removeLabel={(n) => `Remove medicine ${n}`}
    addedLabel={(n) => `Medicine ${n} added`}
    removedLabel={(n) => `Medicine ${n} removed`}
    {min}
    {max}
>
    {#snippet item(entry, index)}
        <label for={`medicine-${index}`}>Name</label>
        <input
            id={`medicine-${index}`}
            bind:value={entry.name}
        />
    {/snippet}
</RepeatableFieldset>
<span data-testid="names">{items.map((x) => x.name).join("|")}</span>
