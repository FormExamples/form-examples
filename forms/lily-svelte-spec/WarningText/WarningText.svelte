<script lang="ts">
    // WarningText component
    //
    // A short warning: an optional decorative icon and one bold line of text (the GOV.UK and DHCW
    // warning-text pattern). The icon is the consumer's (Lily bundles none) and is hidden from
    // assistive technology. The visually hidden prefix, such as "Warning", is part of the
    // consumer's children, in the consumer's language; there is no prop or default for it.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   icon — Snippet, optional. Decorative icon, rendered inside an aria-hidden span.
    //   children — Snippet, required. The hidden prefix, then the warning text.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <WarningText>
    //       {#snippet icon()}!{/snippet}
    //       <span class="screen-reader-span">Warning</span>
    //       You can be fined if you do not register.
    //   </WarningText>
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        icon = undefined,
        children,
        ...restProps
    }: {
        /** Optional CSS class appended to the base class */
        class?: string;
        /** Optional decorative icon (aria-hidden) */
        icon?: Snippet;
        /** The visually hidden prefix, then the warning text */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- WarningText.svelte -->
<div
    class={`warning-text ${className}`}
    {...restProps}
>
    {#if icon}
        <span
            class="warning-text-icon"
            aria-hidden="true">{@render icon()}</span
        >
    {/if}
    <strong class="warning-text-text">{@render children?.()}</strong>
</div>
