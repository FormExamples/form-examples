<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import SankeyChart from "./SankeyChart.svelte";

    const { Story } = defineMeta({
        title: "Headless/SankeyChart",
        component: SankeyChart,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "SankeyChart" }}
>
    <svg viewBox="0 0 10 10"
        ><circle
            cx="5"
            cy="5"
            r="4"
        /></svg
    >
</Story>
