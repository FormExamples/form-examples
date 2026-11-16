<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import GanttTableThead from "./GanttTableThead.svelte";

    const { Story } = defineMeta({
        title: "Headless/GanttTableThead",
        component: GanttTableThead,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <tr><th>Header</th></tr>
</Story>
