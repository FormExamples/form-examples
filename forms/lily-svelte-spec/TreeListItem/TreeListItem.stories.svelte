<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import TreeListItem from "./TreeListItem.svelte";
    const { Story } = defineMeta({
        title: "Headless/TreeListItem",
        component: TreeListItem,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <TreeListItem label="TreeListItem example">
        <span>TreeListItem example</span>
    </TreeListItem>
</Story>
