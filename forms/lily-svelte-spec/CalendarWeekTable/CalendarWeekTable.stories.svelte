<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import CalendarWeekTable from "./CalendarWeekTable.svelte";

    const { Story } = defineMeta({
        title: "Headless/CalendarWeekTable",
        component: CalendarWeekTable,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Week of 6 January 2025" }}
>
    <thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody>
</Story>
