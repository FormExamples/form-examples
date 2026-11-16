<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import EireIndividualHealthIdentifierInput from "./EireIndividualHealthIdentifierInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/EireIndividualHealthIdentifierInput",
        component: EireIndividualHealthIdentifierInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Eire Individual Health Identifier Input" }}
/>
