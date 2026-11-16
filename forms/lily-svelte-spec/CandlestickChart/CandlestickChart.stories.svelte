<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import CandlestickChart from "./CandlestickChart.svelte";
    const { Story } = defineMeta({
        title: "Headless/CandlestickChart",
        component: CandlestickChart,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <CandlestickChart label="CandlestickChart example">
        <span>CandlestickChart example</span>
    </CandlestickChart>
</Story>
