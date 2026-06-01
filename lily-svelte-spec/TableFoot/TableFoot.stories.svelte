<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import TableFoot from "./TableFoot.svelte";
    const { Story } = defineMeta({
        title: "Headless/TableFoot",
        component: TableFoot,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <TableFoot label="TableFoot example">
        <span>TableFoot example</span>
    </TableFoot>
</Story>
