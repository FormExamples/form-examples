<script lang="ts">
    // ChatMessage component
    //
    // One message in a conversation. Renders an <article> with the `chat-message` hook; author, time and
    // body are the consumer's children.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name, rendered as aria-label on the root.
    //   children — Snippet, required. The message content.
    //   ...restProps — additional HTML attributes spread onto the root <article>.
    //
    // Syntax:
    //   <ChatMessage label="…">…</ChatMessage>
    //
    // Examples:
    //   <ChatMessage label="Message from Sam"><p>Hello</p></ChatMessage>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-label comes from `label` when given
    //   - The native <article> element supplies the article role
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //
    // References:
    //   - MDN <article>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article

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

<!-- ChatMessage.svelte -->
<article
    class={`chat-message ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</article>
