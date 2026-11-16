<script lang="ts">
    // ChatNav component
    //
    // The navigation landmark around a conversation (ChatNav > ChatList > ChatListItem). Renders a <nav>
    // with the `chat-nav` hook.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The ChatList.
    //   ...restProps — additional HTML attributes spread onto the root <nav>.
    //
    // Syntax:
    //   <ChatNav label="…">…</ChatNav>
    //
    // Examples:
    //   <ChatNav label="Conversation"><ChatList>…</ChatList></ChatNav>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-label comes from `label` when given
    //   - The native <nav> element supplies the navigation landmark; give it a `label` so it is distinguishable from other navs
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <nav>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav
    import { warnMissingName } from "../dev-warning";

    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        label: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName("ChatNav", label, restProps["aria-label"], restProps["aria-labelledby"]),
    );
</script>

<!-- ChatNav.svelte -->
<nav
    class={`chat-nav ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</nav>
