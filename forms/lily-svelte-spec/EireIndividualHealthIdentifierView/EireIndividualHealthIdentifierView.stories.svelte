<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import EireIndividualHealthIdentifierView from "./EireIndividualHealthIdentifierView.svelte";

    const { Story } = defineMeta({
        title: "Headless/EireIndividualHealthIdentifierView",
        component: EireIndividualHealthIdentifierView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Eire Individual Health Identifier View" }}
/>
