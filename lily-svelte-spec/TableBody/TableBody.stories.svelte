<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import TableBody from "./TableBody.svelte";
    const { Story } = defineMeta({
        title: "Headless/TableBody",
        component: TableBody,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <TableBody label="TableBody example">
        <span>TableBody example</span>
    </TableBody>
</Story>
