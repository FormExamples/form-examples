<script lang="ts">
    // ChatList component
    //
    // The ordered list of messages inside a ChatNav. Renders an <ol> with the `chat-list` hook; messages
    // are in chronological order, oldest first.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The ChatListItem children.
    //   ...restProps — additional HTML attributes spread onto the root <ol>.
    //
    // Syntax:
    //   <ChatList label="…">…</ChatList>
    //
    // Examples:
    //   <ChatNav label="Conversation"><ChatList label="Messages"><ChatListItem>…</ChatListItem></ChatList></ChatNav>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-label comes from `label` when given
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <ol>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol

    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label = undefined,
        children,
        ...restProps
    }: {
        label?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ChatList.svelte -->
<ol
    class={`chat-list ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</ol>
