<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import TableTD from "./TableTD.svelte";
    const { Story } = defineMeta({
        title: "Headless/TableTD",
        component: TableTD,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <TableTD label="TableTD example">
        <span>TableTD example</span>
    </TableTD>
</Story>
