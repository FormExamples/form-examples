<script
    module
    lang="ts"
>
    import { defineMeta } from "@storybook/addon-svelte-csf";
    import ChatListItem from "./ChatListItem.svelte";
    const { Story } = defineMeta({
        title: "Headless/ChatListItem",
        component: ChatListItem,
    });
</script>

<Story
    name="Default"
    tags={["autodocs", "!dev"]}
>
    <!-- An <li> belongs in a list (ChatList renders the <ol>). -->
    <ol>
        <ChatListItem label="ChatListItem example">
            <span>ChatListItem example</span>
        </ChatListItem>
    </ol>
</Story>
