<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import FileTree from "./FileTree.svelte";

    const { Story } = defineMeta({
        title: "Headless/FileTree",
        component: FileTree,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
    args={{ label: "Files" }}
>
    <li
        role="treeitem"
        aria-expanded="true"
    >
        src
        <ul role="group"><li role="treeitem">index.ts</li></ul>
    </li>
    <li role="treeitem">readme.md</li>
</Story>
