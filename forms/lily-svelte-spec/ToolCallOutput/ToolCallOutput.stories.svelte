<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ToolCallOutput from "./ToolCallOutput.svelte";
    const { Story } = defineMeta({
        title: "Headless/ToolCallOutput",
        component: ToolCallOutput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ToolCallOutput label="ToolCallOutput example">
        <span>ToolCallOutput example</span>
    </ToolCallOutput>
</Story>
