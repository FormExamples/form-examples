<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ChatComposer from "./ChatComposer.svelte";
    const { Story } = defineMeta({
        title: "Headless/ChatComposer",
        component: ChatComposer,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <ChatComposer
        label="Message"
        sendLabel="Send"
        stopLabel="Stop"
    >
        <span>ChatComposer example</span>
    </ChatComposer>
</Story>
