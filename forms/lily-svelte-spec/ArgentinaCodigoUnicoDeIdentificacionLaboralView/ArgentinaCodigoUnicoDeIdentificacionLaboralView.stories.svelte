<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ArgentinaCodigoUnicoDeIdentificacionLaboralView from "./ArgentinaCodigoUnicoDeIdentificacionLaboralView.svelte";

    const { Story } = defineMeta({
        title: "Headless/ArgentinaCodigoUnicoDeIdentificacionLaboralView",
        component: ArgentinaCodigoUnicoDeIdentificacionLaboralView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Código Único de Identificación Laboral (CUIL) View" }}
/>
