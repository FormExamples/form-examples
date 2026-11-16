<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ConvertDiv from "./ConvertDiv.svelte";
    const { Story } = defineMeta({
        title: "Headless/ConvertDiv",
        component: ConvertDiv,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ConvertDiv label="Currency converter">
        <span>100 US dollars</span>
    </ConvertDiv>
</Story>
