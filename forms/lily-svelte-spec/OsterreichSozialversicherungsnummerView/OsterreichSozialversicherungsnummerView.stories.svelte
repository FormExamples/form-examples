<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import OsterreichSozialversicherungsnummerView from "./OsterreichSozialversicherungsnummerView.svelte";

    const { Story } = defineMeta({
        title: "Headless/OsterreichSozialversicherungsnummerView",
        component: OsterreichSozialversicherungsnummerView,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Sozialversicherungsnummer (SVNR) View" }}
/>
