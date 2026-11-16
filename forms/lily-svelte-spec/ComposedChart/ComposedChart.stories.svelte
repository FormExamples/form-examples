<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ComposedChart from "./ComposedChart.svelte";
    const { Story } = defineMeta({
        title: "Headless/ComposedChart",
        component: ComposedChart,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ComposedChart label="ComposedChart example">
        <span>ComposedChart example</span>
    </ComposedChart>
</Story>
