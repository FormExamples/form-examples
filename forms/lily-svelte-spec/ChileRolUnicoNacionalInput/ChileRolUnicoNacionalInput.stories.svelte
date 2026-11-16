<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ChileRolUnicoNacionalInput from "./ChileRolUnicoNacionalInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/ChileRolUnicoNacionalInput",
        component: ChileRolUnicoNacionalInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Rol Único Nacional (RUN) Input" }}
/>
