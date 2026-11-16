<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ArgentinaCodigoUnicoDeIdentificacionLaboralInput from "./ArgentinaCodigoUnicoDeIdentificacionLaboralInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/ArgentinaCodigoUnicoDeIdentificacionLaboralInput",
        component: ArgentinaCodigoUnicoDeIdentificacionLaboralInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Código Único de Identificación Laboral (CUIL) Input" }}
/>
