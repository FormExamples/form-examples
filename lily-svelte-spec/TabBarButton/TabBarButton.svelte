<script lang="ts">
    // TabBarButton component
    //
    // A headless tab button for use within a tabbed interface. Renders a <button>
    // with role="tab" and appropriate ARIA attributes for tab selection and panel
    // association. It follows the roving tabindex pattern where only the selected
    // tab participates in the tab order. Designed to be placed inside a TabBar
    // container with role="tablist".
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   selected — boolean, default false. Whether this tab is currently active.
    //   controls — string, required. The id of the associated tabpanel element.
    //   children — Snippet, required. Tab label content.
    //   ...restProps — additional HTML attributes spread onto the <button>.
    //
    // Syntax:
    //   <TabBarButton selected={true} controls="panel-1">Label</TabBarButton>
    //
    // Examples:
    //   <!-- Tab buttons within a TabBar -->
    //   <TabBar label="Settings">
    //     <TabBarButton selected={activeTab === "general"} controls="panel-general"
    //       onclick={() => activeTab = "general"}>General</TabBarButton>
    //     <TabBarButton selected={activeTab === "advanced"} controls="panel-advanced"
    //       onclick={() => activeTab = "advanced"}>Advanced</TabBarButton>
    //   </TabBar>
    //
    // Keyboard:
    //   - Tab: moves focus to the selected tab in the tablist
    //   - ArrowLeft/ArrowRight: moves between tabs (handled by parent tablist)
    //   - Enter/Space: activates the tab (native button behavior)
    //
    // Accessibility:
    //   - role="tab" identifies this element as a tab in a tabbed interface
    //   - aria-selected communicates the selection state to screen readers
    //   - aria-controls links the tab to its panel for assistive technology
    //   - Roving tabindex: selected tab has tabindex=0, others have tabindex=-1
    //   - Compound component: must be placed inside a TabBar container
    //
    // Internationalization:
    //   - All visible text is provided through the children snippet
    //   - No hardcoded strings in the component
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - Compound component: must be used inside a TabBar container
    //   - Consumers manage selection state and panel visibility
    //
    // References:
    //   - WAI-ARIA Tabs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
    //   - WAI-ARIA Tab Role: https://www.w3.org/TR/wai-aria-1.2/#tab

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        selected = false,
        controls,
        children,
        ...restProps
    }: {
        /** Whether this tab is currently active */
        selected?: boolean;
        /** The id of the associated tabpanel element */
        controls: string;
        /** Tab label content */
        children: Snippet;
        /** Additional HTML attributes */
        [key: string]: unknown;
    } = $props();
</script>

<!-- TabBarButton.svelte -->
<button
    class={`tab-bar-button ${className}`}
    role="tab"
    aria-selected={selected}
    aria-controls={controls}
    tabindex={selected ? 0 : -1}
    {...restProps}
>
    {@render children?.()}
</button>
