<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ToolCallStatus from "./ToolCallStatus.svelte";
    const { Story } = defineMeta({
        title: "Headless/ToolCallStatus",
        component: ToolCallStatus,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ToolCallStatus label="ToolCallStatus example">
        <span>ToolCallStatus example</span>
    </ToolCallStatus>
</Story>
