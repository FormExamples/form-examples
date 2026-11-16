<script lang="ts">
    // ChatListItem component
    //
    // One conversation in a ChatList. Renders an <li> with the `chat-list-item` hook; `current` marks the
    // selected conversation with aria-current="true".
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   current — boolean, default false. Sets aria-current="true" when true.
    //   children — Snippet, required. The content.
    //   ...restProps — additional HTML attributes spread onto the root <li>.
    //
    // Syntax:
    //   <ChatListItem current label="…">…</ChatListItem>
    //
    // Examples:
    //   <ChatList><ChatListItem current label="Project chat"><a href="/chat/1">Project chat</a></ChatListItem></ChatList>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-current="true" marks the selected conversation
    //   - aria-label comes from `label` when given
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN aria-current: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current

    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label = undefined,
        current = false,
        children,
        ...restProps
    }: {
        label?: string;
        /** Marks the currently selected conversation (aria-current="true"). */
        current?: boolean;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ChatListItem.svelte -->
<li
    class={`chat-list-item ${className}`}
    aria-label={label}
    aria-current={current ? "true" : undefined}
    {...restProps}
>
    {@render children?.()}
</li>
