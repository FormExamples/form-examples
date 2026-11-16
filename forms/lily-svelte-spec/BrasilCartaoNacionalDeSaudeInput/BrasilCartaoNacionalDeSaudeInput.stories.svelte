<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import BrasilCartaoNacionalDeSaudeInput from "./BrasilCartaoNacionalDeSaudeInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/BrasilCartaoNacionalDeSaudeInput",
        component: BrasilCartaoNacionalDeSaudeInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Cartão Nacional de Saúde (CNS) Input" }}
/>
