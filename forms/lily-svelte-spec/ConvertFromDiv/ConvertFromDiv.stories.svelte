<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ConvertFromDiv from "./ConvertFromDiv.svelte";
    const { Story } = defineMeta({
        title: "Headless/ConvertFromDiv",
        component: ConvertFromDiv,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ConvertFromDiv>
        <span>100 US dollars</span>
    </ConvertFromDiv>
</Story>
