<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MockupTabletPortrait from "./MockupTabletPortrait.svelte";
    const { Story } = defineMeta({
        title: "Headless/MockupTabletPortrait",
        component: MockupTabletPortrait,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <MockupTabletPortrait label="MockupTabletPortrait example">
        <span>MockupTabletPortrait example</span>
    </MockupTabletPortrait>
</Story>
