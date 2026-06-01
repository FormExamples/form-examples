<script lang="ts">
    // TransferList component
    //
    // A dual list box for moving items between two lists. Renders a role="group"
    // container with two <section>s (source and target) and an optional actions
    // region between them. Consumers fill each region with a Listbox or similar.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, REQUIRED. aria-label for the group.
    //   sourceLabel — string, REQUIRED. Heading for the source list.
    //   targetLabel — string, REQUIRED. Heading for the target list.
    //   source — Snippet, REQUIRED. Source list content (typically a Listbox).
    //   target — Snippet, REQUIRED. Target list content.
    //   actions — Snippet, optional. Action buttons between the two lists.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <TransferList label="Roles" sourceLabel="Available" targetLabel="Selected">
    //     {#snippet source()}<ul role="listbox">…</ul>{/snippet}
    //     {#snippet actions()}<button>→</button><button>←</button>{/snippet}
    //     {#snippet target()}<ul role="listbox">…</ul>{/snippet}
    //   </TransferList>
    //
    // Accessibility:
    //   - role="group" with aria-label on container.
    //   - Each list is a <section> with aria-label.
    //
    // Internationalization:
    //   - All labels come through props.
    //
    // Claude rules:
    //   - Headless: no styles.
    //   - label, sourceLabel, targetLabel, source, target are REQUIRED.
    //
    // References:
    //   - Ant Design Transfer: https://ant.design/components/transfer
    //   - WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        sourceLabel,
        targetLabel,
        source,
        target,
        actions = undefined,
        ...restProps
    }: {
        /** CSS class appended to the base class */
        class?: string;
        /** Group accessible label (REQUIRED) */
        label: string;
        /** Source list heading (REQUIRED) */
        sourceLabel: string;
        /** Target list heading (REQUIRED) */
        targetLabel: string;
        /** Source list content (REQUIRED) */
        source: Snippet;
        /** Target list content (REQUIRED) */
        target: Snippet;
        /** Action buttons between the two lists */
        actions?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- TransferList.svelte -->
<div
    class={`transfer-list ${className}`}
    role="group"
    aria-label={label}
    {...restProps}
>
    <section class="transfer-list-source" aria-label={sourceLabel}>
        {@render source()}
    </section>
    {#if actions}
        <div class="transfer-list-actions">
            {@render actions()}
        </div>
    {/if}
    <section class="transfer-list-target" aria-label={targetLabel}>
        {@render target()}
    </section>
</div>
