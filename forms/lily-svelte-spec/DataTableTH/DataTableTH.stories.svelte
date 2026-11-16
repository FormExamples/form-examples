<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import DataTableTH from "./DataTableTH.svelte";

    const { Story } = defineMeta({
        title: "Headless/DataTableTH",
        component: DataTableTH,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
/>
