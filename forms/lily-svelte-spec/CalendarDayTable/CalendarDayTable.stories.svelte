<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import CalendarDayTable from "./CalendarDayTable.svelte";

    const { Story } = defineMeta({
        title: "Headless/CalendarDayTable",
        component: CalendarDayTable,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Monday 6 January 2025" }}
>
    <thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody>
</Story>
