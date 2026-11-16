<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ConvertIntoDiv from "./ConvertIntoDiv.svelte";
    const { Story } = defineMeta({
        title: "Headless/ConvertIntoDiv",
        component: ConvertIntoDiv,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ConvertIntoDiv>
        <span>100 US dollars</span>
    </ConvertIntoDiv>
</Story>
