<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import FunnelChart from "./FunnelChart.svelte";
    const { Story } = defineMeta({
        title: "Headless/FunnelChart",
        component: FunnelChart,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <FunnelChart label="FunnelChart example">
        <span>FunnelChart example</span>
    </FunnelChart>
</Story>
