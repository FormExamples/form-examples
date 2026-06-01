<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import CodeBlock from "./CodeBlock.svelte";
    const { Story } = defineMeta({
        title: "Headless/CodeBlock",
        component: CodeBlock,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <CodeBlock label="CodeBlock example">
        <span>CodeBlock example</span>
    </CodeBlock>
</Story>
