<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import TableRow from "./TableRow.svelte";
    const { Story } = defineMeta({
        title: "Headless/TableRow",
        component: TableRow,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <TableRow label="TableRow example">
        <span>TableRow example</span>
    </TableRow>
</Story>
