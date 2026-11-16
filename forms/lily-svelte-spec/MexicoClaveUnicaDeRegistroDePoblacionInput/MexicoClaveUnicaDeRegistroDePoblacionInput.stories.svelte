<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MexicoClaveUnicaDeRegistroDePoblacionInput from "./MexicoClaveUnicaDeRegistroDePoblacionInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/MexicoClaveUnicaDeRegistroDePoblacionInput",
        component: MexicoClaveUnicaDeRegistroDePoblacionInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Clave Única de Registro de Población (CURP) Input" }}
/>
