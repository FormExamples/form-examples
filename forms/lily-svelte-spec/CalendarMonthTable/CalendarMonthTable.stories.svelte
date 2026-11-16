<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import CalendarMonthTable from "./CalendarMonthTable.svelte";

    const { Story } = defineMeta({
        title: "Headless/CalendarMonthTable",
        component: CalendarMonthTable,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "January 2025" }}
>
    <thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody>
</Story>
