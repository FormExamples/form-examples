<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import TreeMenu from "./TreeMenu.svelte";
    const { Story } = defineMeta({
        title: "Headless/TreeMenu",
        component: TreeMenu,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <TreeMenu label="TreeMenu example">
        <span>TreeMenu example</span>
    </TreeMenu>
</Story>
