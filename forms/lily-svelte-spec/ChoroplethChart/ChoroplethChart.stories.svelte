<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ChoroplethChart from "./ChoroplethChart.svelte";
    const { Story } = defineMeta({
        title: "Headless/ChoroplethChart",
        component: ChoroplethChart,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ChoroplethChart label="ChoroplethChart example">
        <span>ChoroplethChart example</span>
    </ChoroplethChart>
</Story>
