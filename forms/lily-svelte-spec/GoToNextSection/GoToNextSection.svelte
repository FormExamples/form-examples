<script lang="ts">
    // GoToNextSection component
    //
    // A link that takes the user to the next section of the current page. Renders an <a> with the `go-to-
    // next-section` hook whose visible text and accessible name are both `label`.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. The link text, also set as aria-label.
    //   href — string, required. The URL of the next section, typically #section-id.
    //   ...restProps — additional HTML attributes spread onto the root <a>.
    //
    // Syntax:
    //   <GoToNextSection href="#…" label="…" />
    //
    // Examples:
    //   <GoToNextSection href="#section-id" label="…" />
    //
    // Keyboard:
    //   - Tab: moves focus onto the link
    //   - Enter: follows the link (native browser behaviour)
    //
    // Accessibility:
    //   - A native <a href> link: the destination and the link text give the role and name
    //   - aria-label repeats the visible text; keep them identical (WCAG 2.5.3)
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - The link text is the consumer's translated `label`; the component has no text of its own
    //
    // References:
    //   - MDN <a>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a

    import { warnMissingName } from "../dev-warning";

    let {
        class: className = "",
        label,
        href,
        ...restProps
    }: {
        label: string;
        href: string;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName(
            "GoToNextSection",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );
</script>

<!-- GoToNextSection.svelte -->
<a
    class={`go-to-next-section ${className}`}
    {href}
    aria-label={label}
    {...restProps}>{label}</a
>
