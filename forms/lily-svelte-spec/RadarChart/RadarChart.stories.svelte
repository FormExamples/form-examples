<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import RadarChart from "./RadarChart.svelte";

    const { Story } = defineMeta({
        title: "Headless/RadarChart",
        component: RadarChart,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "RadarChart" }}
>
    <svg viewBox="0 0 10 10"
        ><circle
            cx="5"
            cy="5"
            r="4"
        /></svg
    >
</Story>
