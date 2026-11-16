<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import HeatmapChartWithYearOfDays from "./HeatmapChartWithYearOfDays.svelte";

    const { Story } = defineMeta({
        title: "Headless/HeatmapChartWithYearOfDays",
        component: HeatmapChartWithYearOfDays,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "HeatmapChartWithYearOfDays", year: 2026, weekStart: 0 }}
>
    <svg viewBox="0 0 10 10"
        ><circle
            cx="5"
            cy="5"
            r="4"
        /></svg
    >
</Story>
