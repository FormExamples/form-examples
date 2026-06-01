<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MockupShell from "./MockupShell.svelte";
    const { Story } = defineMeta({
        title: "Headless/MockupShell",
        component: MockupShell,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <MockupShell label="MockupShell example">
        <span>MockupShell example</span>
    </MockupShell>
</Story>
