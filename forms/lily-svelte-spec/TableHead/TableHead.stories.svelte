<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import TableHead from "./TableHead.svelte";
    const { Story } = defineMeta({
        title: "Headless/TableHead",
        component: TableHead,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <TableHead label="TableHead example">
        <span>TableHead example</span>
    </TableHead>
</Story>
