<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ColombiaCedulaDeCiudadaniaInput from "./ColombiaCedulaDeCiudadaniaInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/ColombiaCedulaDeCiudadaniaInput",
        component: ColombiaCedulaDeCiudadaniaInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Cedula de Ciudadania Number Input" }}
/>
