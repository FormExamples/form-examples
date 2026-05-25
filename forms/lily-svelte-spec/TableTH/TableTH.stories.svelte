<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import TableTH from "./TableTH.svelte";
    const { Story } = defineMeta({
        title: "Headless/TableTH",
        component: TableTH,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <TableTH label="TableTH example">
        <span>TableTH example</span>
    </TableTH>
</Story>
