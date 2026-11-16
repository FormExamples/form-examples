<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import AustraliaTaxFileNumberInput from "./AustraliaTaxFileNumberInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/AustraliaTaxFileNumberInput",
        component: AustraliaTaxFileNumberInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Tax File Number (TFN) Input" }}
/>
