<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MockupBrowser from "./MockupBrowser.svelte";
    const { Story } = defineMeta({
        title: "Headless/MockupBrowser",
        component: MockupBrowser,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <MockupBrowser label="MockupBrowser example">
        <span>MockupBrowser example</span>
    </MockupBrowser>
</Story>
