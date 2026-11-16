<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import EcuadorCedulaDeIdentidadInput from "./EcuadorCedulaDeIdentidadInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/EcuadorCedulaDeIdentidadInput",
        component: EcuadorCedulaDeIdentidadInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Cedula de Identidad Number Input" }}
/>
