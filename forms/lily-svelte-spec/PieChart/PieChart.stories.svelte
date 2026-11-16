<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import PieChart from "./PieChart.svelte";
    const { Story } = defineMeta({
        title: "Headless/PieChart",
        component: PieChart,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <PieChart label="PieChart example">
        <span>PieChart example</span>
    </PieChart>
</Story>
