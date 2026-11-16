<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ToolCall from "./ToolCall.svelte";
    const { Story } = defineMeta({
        title: "Headless/ToolCall",
        component: ToolCall,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ToolCall label="ToolCall example">
        <span>ToolCall example</span>
    </ToolCall>
</Story>
