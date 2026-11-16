<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import LuxembourgMatriculeView from "./LuxembourgMatriculeView.svelte";

    const { Story } = defineMeta({
        title: "Headless/LuxembourgMatriculeView",
        component: LuxembourgMatriculeView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Numéro d'Identification Nationale (Matricule) View" }}
/>
