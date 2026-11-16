<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ToolCallName from "./ToolCallName.svelte";
    const { Story } = defineMeta({
        title: "Headless/ToolCallName",
        component: ToolCallName,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ToolCallName label="ToolCallName example">
        <span>ToolCallName example</span>
    </ToolCallName>
</Story>
