<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import SchweizAhvNummerView from "./SchweizAhvNummerView.svelte";

    const { Story } = defineMeta({
        title: "Headless/SchweizAhvNummerView",
        component: SchweizAhvNummerView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "AHV-Nummer / Numéro AVS View" }}
/>
