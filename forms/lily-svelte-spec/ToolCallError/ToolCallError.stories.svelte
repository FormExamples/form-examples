<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ToolCallError from "./ToolCallError.svelte";
    const { Story } = defineMeta({
        title: "Headless/ToolCallError",
        component: ToolCallError,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ToolCallError label="ToolCallError example">
        <span>ToolCallError example</span>
    </ToolCallError>
</Story>
