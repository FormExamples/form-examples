<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ConvertIntoValueDiv from "./ConvertIntoValueDiv.svelte";
    const { Story } = defineMeta({
        title: "Headless/ConvertIntoValueDiv",
        component: ConvertIntoValueDiv,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ConvertIntoValueDiv>
        <span>100 US dollars</span>
    </ConvertIntoValueDiv>
</Story>
