<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import SchweizAhvNummerInput from "./SchweizAhvNummerInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/SchweizAhvNummerInput",
        component: SchweizAhvNummerInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "AHV-Nummer / Numéro AVS Input" }}
/>
