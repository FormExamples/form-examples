<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import Code from "./Code.svelte";
    const { Story } = defineMeta({
        title: "Headless/Code",
        component: Code,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <Code label="Code example">
        <span>Code example</span>
    </Code>
</Story>
