<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import RingChart from "./RingChart.svelte";
    const { Story } = defineMeta({
        title: "Headless/RingChart",
        component: RingChart,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <RingChart label="RingChart example">
        <span>RingChart example</span>
    </RingChart>
</Story>
