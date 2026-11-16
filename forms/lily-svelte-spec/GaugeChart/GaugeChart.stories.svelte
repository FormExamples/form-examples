<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import GaugeChart from "./GaugeChart.svelte";

    const { Story } = defineMeta({
        title: "Headless/GaugeChart",
        component: GaugeChart,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "GaugeChart" }}
>
    <svg viewBox="0 0 10 10"
        ><circle
            cx="5"
            cy="5"
            r="4"
        /></svg
    >
</Story>
