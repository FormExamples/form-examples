<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ChatMessage from "./ChatMessage.svelte";
    const { Story } = defineMeta({
        title: "Headless/ChatMessage",
        component: ChatMessage,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <ChatMessage label="ChatMessage example">
        <span>ChatMessage example</span>
    </ChatMessage>
</Story>
