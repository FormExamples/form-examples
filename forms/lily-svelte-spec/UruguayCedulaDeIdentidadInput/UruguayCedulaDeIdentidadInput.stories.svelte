<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import UruguayCedulaDeIdentidadInput from "./UruguayCedulaDeIdentidadInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/UruguayCedulaDeIdentidadInput",
        component: UruguayCedulaDeIdentidadInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Cedula de Identidad Number Input" }}
/>
