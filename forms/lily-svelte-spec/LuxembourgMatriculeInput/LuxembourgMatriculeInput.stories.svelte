<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import LuxembourgMatriculeInput from "./LuxembourgMatriculeInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/LuxembourgMatriculeInput",
        component: LuxembourgMatriculeInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Numéro d'Identification Nationale (Matricule) Input" }}
/>
