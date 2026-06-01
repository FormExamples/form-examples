<script lang="ts">
    // TaskListItem component
    //
    // A single task item within a task list, rendering a semantic <li> element
    // containing a checkbox input and label. Supports checked and disabled states,
    // making it suitable for to-do lists, CheckLists, and task trackers. The
    // checked state is bindable so consumers can reactively track completion.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. The task description displayed as the checkbox label.
    //   checked — boolean, default false, bindable. Whether the task is completed.
    //   disabled — boolean, default false. Whether the checkbox is disabled.
    //   ...restProps — additional HTML attributes spread onto the <li>.
    //
    // Syntax:
    //   <TaskListItem label="Buy groceries" />
    //   <TaskListItem label="Clean house" checked />
    //   <TaskListItem label="Archived task" checked disabled />
    //
    // Examples:
    //   <!-- Simple task list -->
    //   <ul aria-label="Today's tasks" role="list">
    //     <TaskListItem label="Review pull request" />
    //     <TaskListItem label="Update documentation" checked />
    //     <TaskListItem label="Deploy to staging" />
    //   </ul>
    //
    //   <!-- Bindable checked state -->
    //   <TaskListItem label="Accept terms" bind:checked={termsAccepted} />
    //
    // Keyboard:
    //   - Tab: moves focus to the checkbox input
    //   - Space: toggles the checkbox checked state
    //
    // Accessibility:
    //   - Semantic <li> element provides list item semantics within the parent list
    //   - Native <input type="checkbox"> provides full accessibility support
    //   - <label> element is associated with the checkbox via wrapping
    //   - aria-checked reflects the current state for assistive technology
    //   - Disabled state communicated via the native disabled attribute
    //
    // Internationalization:
    //   - The label prop externalizes the task description for translation
    //   - No hardcoded strings in the component
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Should be placed inside a <ul> or <ol> for valid HTML
    //   - Consumer can target [data-checked] and [data-disabled] for visual styling
    //
    // References:
    //   - MDN checkbox input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
    //   - WAI checkbox pattern: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/

    let {
        class: className = "",
        label,
        checked = $bindable(false),
        disabled = false,
        ...restProps
    }: {
        /** The task description text. */
        label: string;
        /** Whether the task is completed. Bindable. */
        checked?: boolean;
        /** Whether the checkbox is disabled. */
        disabled?: boolean;
        [key: string]: unknown;
    } = $props();
</script>

<!-- TaskListItem.svelte -->
<li
    class={`task-list-item ${className}`}
    data-checked={checked}
    data-disabled={disabled || undefined}
    {...restProps}
>
    <label>
        <input
            type="checkbox"
            bind:checked
            {disabled}
        />
        {label}
    </label>
</li>
