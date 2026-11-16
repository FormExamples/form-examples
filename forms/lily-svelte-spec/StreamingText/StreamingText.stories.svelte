<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import StreamingText from "./StreamingText.svelte";
    const { Story } = defineMeta({
        title: "Headless/StreamingText",
        component: StreamingText,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <StreamingText label="StreamingText example">
        <span>StreamingText example</span>
    </StreamingText>
</Story>
