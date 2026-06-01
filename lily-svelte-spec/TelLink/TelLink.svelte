<script lang="ts">
    // TelLink component
    //
    // A headless phone number link that renders a clickable tel: link, allowing
    // users on mobile devices to initiate a phone call by tapping the number.
    // Useful for contact pages, business listings, user profiles, and customer
    // support sections. This is the read-only display counterpart in the
    // Input/View pattern alongside TelInput.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   phone — string, required. The phone number to display and link to (should include country code).
    //   label — string, default undefined. Optional accessible name via aria-label for additional context.
    //   ...restProps — additional HTML attributes spread onto the <a>.
    //
    // Syntax:
    //   <TelLink phone="+1-555-0100" />
    //
    // Examples:
    //   <!-- Phone link with accessible context -->
    //   <TelLink phone="+1-555-0100" label="Call customer support" />
    //
    // Keyboard:
    //   - Tab: focus the link (native <a> behavior)
    //   - Enter: activate the link (native <a> behavior)
    //
    // Accessibility:
    //   - Native <a> element provides link role and keyboard activation
    //   - aria-label, when provided, gives accessible context beyond the phone number text
    //
    // Internationalization:
    //   - The label prop accepts any translated string
    //   - Phone number format is consumer-controlled
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - No internal state; purely presentational
    //
    // References:
    //   - MDN tel: links: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#linking_to_telephone_numbers
    //   - WAI-ARIA Link Role: https://www.w3.org/TR/wai-aria-1.2/#link

    let {
        class: className = "",
        phone,
        label = undefined,
        ...restProps
    }: {
        phone: string;
        label?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- TelLink.svelte -->
<a
    class={`tel-link ${className}`}
    href="tel:{phone}"
    aria-label={label}
    {...restProps}>{phone}</a
>
