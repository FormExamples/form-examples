<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ConvertFromValueDiv from "./ConvertFromValueDiv.svelte";
    const { Story } = defineMeta({
        title: "Headless/ConvertFromValueDiv",
        component: ConvertFromValueDiv,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ConvertFromValueDiv>
        <span>100 US dollars</span>
    </ConvertFromValueDiv>
</Story>
