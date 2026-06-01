<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import TreeLink from "./TreeLink.svelte";
    const { Story } = defineMeta({
        title: "Headless/TreeLink",
        component: TreeLink,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <TreeLink label="TreeLink example">
        <span>TreeLink example</span>
    </TreeLink>
</Story>
