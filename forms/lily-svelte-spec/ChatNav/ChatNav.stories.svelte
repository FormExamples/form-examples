<script module lang="ts">
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ChatNav from "./ChatNav.svelte";
    const { Story } = defineMeta({
        title: "Headless/ChatNav",
        component: ChatNav,
    });
</script>

<Story name="Default" tags={["autodocs", "!dev"]}>
    <ChatNav label="ChatNav example">
        <span>ChatNav example</span>
    </ChatNav>
</Story>
