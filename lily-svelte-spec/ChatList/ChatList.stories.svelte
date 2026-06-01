<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ChatList from "./ChatList.svelte";
    const { Story } = defineMeta({
        title: "Headless/ChatList",
        component: ChatList,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <ChatList label="ChatList example">
        <span>ChatList example</span>
    </ChatList>
</Story>
