<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ToolCallInput from "./ToolCallInput.svelte";
    const { Story } = defineMeta({
        title: "Headless/ToolCallInput",
        component: ToolCallInput,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ToolCallInput label="ToolCallInput example">
        <span>ToolCallInput example</span>
    </ToolCallInput>
</Story>
