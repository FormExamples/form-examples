<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MockupTabletLandscape from "./MockupTabletLandscape.svelte";
    const { Story } = defineMeta({
        title: "Headless/MockupTabletLandscape",
        component: MockupTabletLandscape,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <MockupTabletLandscape label="MockupTabletLandscape example">
        <span>MockupTabletLandscape example</span>
    </MockupTabletLandscape>
</Story>
