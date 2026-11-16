<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ColombiaCedulaDeCiudadaniaView from "./ColombiaCedulaDeCiudadaniaView.svelte";

    const { Story } = defineMeta({
        title: "Headless/ColombiaCedulaDeCiudadaniaView",
        component: ColombiaCedulaDeCiudadaniaView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Cedula de Ciudadania Number View" }}
/>
