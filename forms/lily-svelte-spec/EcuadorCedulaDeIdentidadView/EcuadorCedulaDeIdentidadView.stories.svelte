<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import EcuadorCedulaDeIdentidadView from "./EcuadorCedulaDeIdentidadView.svelte";

    const { Story } = defineMeta({
        title: "Headless/EcuadorCedulaDeIdentidadView",
        component: EcuadorCedulaDeIdentidadView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Cedula de Identidad Number View" }}
/>
