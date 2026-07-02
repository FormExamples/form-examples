<script lang="ts">
    // Progress component
    //
    // A headless progress indicator using the native HTML <progress> element with
    // built-in semantic meaning and accessibility. It supports both determinate
    // progress (with a known value and maximum) and indeterminate progress (when
    // value is undefined, indicating an ongoing process of unknown duration).
    // Commonly used for file uploads, form submissions, loading sequences, and
    // installation wizards.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. Accessible name via aria-label describing what process is tracked.
    //   value — number, default undefined. Current progress value; undefined means indeterminate.
    //   max — number, default 100. Maximum value representing 100% completion.
    //   ...restProps — additional HTML attributes spread onto the <progress>.
    //
    // Syntax:
    //   <Progress label="Upload progress" value={50} />
    //
    // Examples:
    //   <!-- Determinate progress at 50% -->
    //   <Progress label="Upload progress" value={50} max={100} />
    //
    //   <!-- Indeterminate loading (no value) -->
    //   <Progress label="Loading" />
    //
    //   <!-- Step-based progress (3 of 5 steps) -->
    //   <Progress label="Installation" value={3} max={5} />
    //
    // Keyboard:
    //   None — this is a passive display element that does not accept user input.
    //
    // Accessibility:
    //   - aria-label describes what process the progress bar represents
    //   - The <progress> element implicitly has role="progressbar" with aria-valuenow,
    //     aria-valuemin, and aria-valuemax managed by the browser
    //
    // Internationalization:
    //   - The label prop is the only user-facing text; no hardcoded strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Uses native <progress> element, not a <div> with role="progressbar"
    //   - When value is undefined, the progress bar is indeterminate
    //   - Do not wrap in a container — renders a bare <progress> element
    //
    // References:
    //   - MDN progress element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress
    //   - WAI-ARIA progressbar role: https://www.w3.org/WAI/ARIA/apg/patterns/meter/

    let {
        class: className = "",
        label,
        value = undefined,
        max = 100,
        ...restProps
    }: {
        /** Accessible label. */
        label: string;
        /** Current value. Undefined means indeterminate. */
        value?: number;
        /** Maximum value. */
        max?: number;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Progress.svelte -->
<progress
    class={`progress ${className}`}
    aria-label={label}
    {value}
    {max}
    {...restProps}
></progress>
