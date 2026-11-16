<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import DigitalObjectIdentifierLink from "./DigitalObjectIdentifierLink.svelte";
    const { Story } = defineMeta({
        title: "Headless/DigitalObjectIdentifierLink",
        component: DigitalObjectIdentifierLink,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <DigitalObjectIdentifierLink doi="10.1000/xyz123" />
</Story>
