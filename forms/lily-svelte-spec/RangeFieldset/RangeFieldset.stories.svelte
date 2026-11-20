<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import RangeFieldset from "./RangeFieldset.svelte";
    const { Story } = defineMeta({
        title: "Headless/RangeFieldset",
        component: RangeFieldset,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <RangeFieldset
        legend="Price"
        minimumLabel="Lowest price"
        maximumLabel="Highest price"
        minimum={20}
        maximum={80}
        minimumName="price-min"
        maximumName="price-max"
    />
</Story>
