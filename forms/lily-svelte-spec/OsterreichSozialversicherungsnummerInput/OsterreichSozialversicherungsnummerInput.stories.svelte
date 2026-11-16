<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import OsterreichSozialversicherungsnummerInput from "./OsterreichSozialversicherungsnummerInput.svelte";

    const { Story } = defineMeta({
        title: "Headless/OsterreichSozialversicherungsnummerInput",
        component: OsterreichSozialversicherungsnummerInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Sozialversicherungsnummer (SVNR) Input" }}
/>
