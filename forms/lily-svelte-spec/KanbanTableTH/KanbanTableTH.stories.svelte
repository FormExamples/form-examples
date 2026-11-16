<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import KanbanTableTH from "./KanbanTableTH.svelte";

    const { Story } = defineMeta({
        title: "Headless/KanbanTableTH",
        component: KanbanTableTH,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
/>
