<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import AustraliaTaxFileNumberView from "./AustraliaTaxFileNumberView.svelte";

    const { Story } = defineMeta({
        title: "Headless/AustraliaTaxFileNumberView",
        component: AustraliaTaxFileNumberView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Tax File Number (TFN) View" }}
/>
