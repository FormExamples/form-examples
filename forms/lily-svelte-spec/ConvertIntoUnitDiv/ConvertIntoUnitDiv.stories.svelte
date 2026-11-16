<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ConvertIntoUnitDiv from "./ConvertIntoUnitDiv.svelte";
    const { Story } = defineMeta({
        title: "Headless/ConvertIntoUnitDiv",
        component: ConvertIntoUnitDiv,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ConvertIntoUnitDiv>
        <span>100 US dollars</span>
    </ConvertIntoUnitDiv>
</Story>
