<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ConvertFromUnitDiv from "./ConvertFromUnitDiv.svelte";
    const { Story } = defineMeta({
        title: "Headless/ConvertFromUnitDiv",
        component: ConvertFromUnitDiv,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ConvertFromUnitDiv>
        <span>100 US dollars</span>
    </ConvertFromUnitDiv>
</Story>
