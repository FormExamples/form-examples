<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import SunburstChart from "./SunburstChart.svelte";
    const { Story } = defineMeta({
        title: "Headless/SunburstChart",
        component: SunburstChart,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <SunburstChart label="SunburstChart example">
        <span>SunburstChart example</span>
    </SunburstChart>
</Story>
