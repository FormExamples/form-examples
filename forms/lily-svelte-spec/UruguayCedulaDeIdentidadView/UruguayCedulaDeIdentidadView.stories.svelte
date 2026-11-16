<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import UruguayCedulaDeIdentidadView from "./UruguayCedulaDeIdentidadView.svelte";

    const { Story } = defineMeta({
        title: "Headless/UruguayCedulaDeIdentidadView",
        component: UruguayCedulaDeIdentidadView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Cedula de Identidad Number View" }}
/>
