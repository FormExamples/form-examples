<script lang="ts">
    // AvatarGroup component
    //
    // A container that groups several avatars. It renders the `avatar-group` hook around its children in
    // source order; overlap, spacing and truncation are the consumer's CSS.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Accessible name for the group, rendered as aria-label.
    //   children — Snippet, required. The avatar components.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <AvatarGroup label="…"><Avatar>…</Avatar><Avatar>…</Avatar></AvatarGroup>
    //
    // Examples:
    //   <AvatarGroup label="Reviewers"><Avatar><AvatarText>AB</AvatarText></Avatar><Avatar><AvatarText>CD</AvatarText></Avatar></AvatarGroup>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys
    //
    // Accessibility:
    //   - aria-label comes from `label` when given
    //   - This component does not render role="group"; pass role="group" through restProps so the label is announced
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Order is source order; the component does not truncate or count overflow
    //
    // References:
    //   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

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

<!-- AvatarGroup.svelte -->
<div
    class={`avatar-group ${className}`}
    role="group"
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
