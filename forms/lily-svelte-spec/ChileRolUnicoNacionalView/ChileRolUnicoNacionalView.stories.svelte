<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ChileRolUnicoNacionalView from "./ChileRolUnicoNacionalView.svelte";

    const { Story } = defineMeta({
        title: "Headless/ChileRolUnicoNacionalView",
        component: ChileRolUnicoNacionalView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Rol Único Nacional (RUN) View" }}
/>
