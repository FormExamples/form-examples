<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import SouthAfricaIdentityNumberInput from "./SouthAfricaIdentityNumberInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/SouthAfricaIdentityNumberInput",
        component: SouthAfricaIdentityNumberInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "South African Identity Number Input" }}
/>
