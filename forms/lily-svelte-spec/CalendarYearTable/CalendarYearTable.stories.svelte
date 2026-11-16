<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import CalendarYearTable from "./CalendarYearTable.svelte";

    const { Story } = defineMeta({
        title: "Headless/CalendarYearTable",
        component: CalendarYearTable,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "2025" }}
>
    <thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody>
</Story>
