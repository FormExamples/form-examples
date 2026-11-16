<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MexicoClaveUnicaDeRegistroDePoblacionView from "./MexicoClaveUnicaDeRegistroDePoblacionView.svelte";

    const { Story } = defineMeta({
        title: "Headless/MexicoClaveUnicaDeRegistroDePoblacionView",
        component: MexicoClaveUnicaDeRegistroDePoblacionView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Clave Única de Registro de Población (CURP) View" }}
/>
