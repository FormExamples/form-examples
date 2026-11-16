<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import GanttTableTbody from "./GanttTableTbody.svelte";

    const { Story } = defineMeta({
        title: "Headless/GanttTableTbody",
        component: GanttTableTbody,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <tr><td>Data</td></tr>
</Story>
