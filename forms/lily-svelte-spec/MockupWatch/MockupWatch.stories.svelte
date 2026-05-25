<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import MockupWatch from "./MockupWatch.svelte";
    const { Story } = defineMeta({
        title: "Headless/MockupWatch",
        component: MockupWatch,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <MockupWatch label="MockupWatch example">
        <span>MockupWatch example</span>
    </MockupWatch>
</Story>
