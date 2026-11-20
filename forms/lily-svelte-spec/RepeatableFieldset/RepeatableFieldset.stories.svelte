<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import RepeatableFieldset from "./RepeatableFieldset.svelte";
    const { Story } = defineMeta({
        title: "Headless/RepeatableFieldset",
        component: RepeatableFieldset,
    });
</script>

<script lang="ts">
    let medicines = $state([{ name: "Aspirin" }]);
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <RepeatableFieldset
        legend="Medicines"
        bind:items={medicines}
        newItem={() => ({ name: "" })}
        itemLegend={(n) => `Medicine ${n}`}
        addLabel="Add another medicine"
        removeLabel={(n) => `Remove medicine ${n}`}
        addedLabel={(n) => `Medicine ${n} added`}
        removedLabel={(n) => `Medicine ${n} removed`}
    >
        {#snippet item(medicine, index)}
            <label for={`story-medicine-${index}`}>Name</label>
            <input
                id={`story-medicine-${index}`}
                bind:value={medicine.name}
            />
        {/snippet}
    </RepeatableFieldset>
</Story>
