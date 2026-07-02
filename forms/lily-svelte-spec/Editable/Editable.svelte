<script lang="ts">
    // Editable component
    //
    // An inline-editable text component that toggles between a read-only display
    // and an input field for editing. In display mode it renders a <span> with
    // role="button"; in edit mode it renders an <input type="text">. Pressing
    // Enter confirms the edit and Escape cancels it, reverting to the original value.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   value — string, default "". Current text value; bindable.
    //   label — string, required. Accessible name for the editable control.
    //   editing — boolean, default false. Whether the component is in edit mode; bindable.
    //   disabled — boolean, default false. Whether editing is disabled.
    //   ...restProps — additional HTML attributes spread onto the <span> or <input>.
    //
    // Syntax:
    //   <Editable label="Name" bind:value />
    //
    // Examples:
    //   <!-- Basic inline edit -->
    //   <Editable label="Name" bind:value />
    //
    //   <!-- With external editing state control -->
    //   <Editable label="Title" bind:value bind:editing />
    //
    // Keyboard:
    //   - Enter (display mode): activate edit mode
    //   - Space (display mode): activate edit mode
    //   - Enter (edit mode): confirm the edit and return to display mode
    //   - Escape (edit mode): cancel the edit and return to display mode
    //
    // Accessibility:
    //   - role="button" on the display span indicates it is activatable
    //   - aria-label provides the accessible name in both modes
    //   - aria-disabled on the span when disabled
    //   - tabindex="0" when enabled, tabindex="-1" when disabled
    //
    // Internationalization:
    //   - The label prop accepts any string; consumers provide localized text
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses internal draft state to allow cancel without losing original value
    //   - Both value and editing support $bindable() two-way binding
    //
    // References:
    //   - WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/

    let {
        class: className = "",
        value = $bindable(""),
        label,
        editing = $bindable(false),
        disabled = false,
        ...restProps
    }: {
        /** Current text value. Bindable. */
        value?: string;
        /** Accessible label for the editable control. */
        label: string;
        /** Whether the component is in edit mode. Bindable. */
        editing?: boolean;
        /** Whether editing is disabled. */
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();

    let draft = $state(value);

    function startEditing() {
        if (disabled) return;
        draft = value;
        editing = true;
    }

    function confirm() {
        value = draft;
        editing = false;
    }

    function cancel() {
        draft = value;
        editing = false;
    }

    function onkeydown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            event.preventDefault();
            confirm();
        } else if (event.key === "Escape") {
            event.preventDefault();
            cancel();
        }
    }
</script>

<!-- Editable.svelte -->
{#if editing}
    <input
        class={`editable ${className}`}
        type="text"
        aria-label={label}
        bind:value={draft}
        {onkeydown}
        {...restProps}
    />
{:else}
    <span
        class={`editable ${className}`}
        role="button"
        tabindex={disabled ? -1 : 0}
        aria-label={label}
        aria-disabled={disabled || undefined}
        onclick={startEditing}
        onkeydown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                startEditing();
            }
        }}
        {...restProps}
    >
        {value}
    </span>
{/if}
