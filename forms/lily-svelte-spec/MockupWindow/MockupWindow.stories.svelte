<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MockupWindow from "./MockupWindow.svelte";
    const { Story } = defineMeta({
        title: "Headless/MockupWindow",
        component: MockupWindow,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <MockupWindow label="MockupWindow example">
        <span>MockupWindow example</span>
    </MockupWindow>
</Story>
