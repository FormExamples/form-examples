<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import HeatmapChart from "./HeatmapChart.svelte";

    const { Story } = defineMeta({
        title: "Headless/HeatmapChart",
        component: HeatmapChart,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "HeatmapChart" }}
>
    <svg viewBox="0 0 10 10"
        ><circle
            cx="5"
            cy="5"
            r="4"
        /></svg
    >
</Story>
