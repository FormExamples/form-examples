<script lang="ts">
    // NewsletterSignup component
    //
    // An email subscription form composition with idle, submitting, success,
    // and error states. Renders a native <form> with an email input, submit
    // button, and conditionally-hidden status/alert paragraphs for success
    // and error messages.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   label — string, REQUIRED. aria-label for the form.
    //   heading — string, optional. Visible heading text.
    //   description — string, optional. Body text below the heading.
    //   emailLabel — string, REQUIRED. Visible label for the email input.
    //   emailPlaceholder — string, optional. Email input placeholder.
    //   submitLabel — string, REQUIRED. Submit button text.
    //   state — "idle" | "submitting" | "success" | "error", default "idle".
    //   successMessage — string, optional. Message shown when state is "success".
    //   errorMessage — string, optional. Message shown when state is "error".
    //   onsubmit — (event: SubmitEvent) => void, optional. Submit handler.
    //   ...restProps — additional HTML attributes spread onto the <form>.
    //
    // Syntax:
    //   <NewsletterSignup
    //     label="Subscribe to newsletter"
    //     emailLabel="Email"
    //     submitLabel="Subscribe"
    //     state={state}
    //     successMessage="Thanks!"
    //     errorMessage="Something went wrong."
    //     onsubmit={handleSubmit}
    //   />
    //
    // Accessibility:
    //   - Form has aria-label
    //   - Success message uses role="status" + aria-live="polite"
    //   - Error message uses role="alert"
    //   - Both status messages are conditionally hidden based on state
    //
    // Internationalization:
    //   - All text content via props
    //
    // Claude rules:
    //   - Headless: no styles
    //   - label, emailLabel, submitLabel are REQUIRED — TypeScript reflects this

    let {
        class: className = "",
        label,
        heading = undefined,
        description = undefined,
        emailLabel,
        emailPlaceholder = undefined,
        submitLabel,
        state = "idle",
        successMessage = undefined,
        errorMessage = undefined,
        onsubmit = undefined,
        ...restProps
    }: {
        /** Consumer CSS class appended to base class */
        class?: string;
        /** aria-label for the form (REQUIRED) */
        label: string;
        /** Visible heading text */
        heading?: string;
        /** Body text below the heading */
        description?: string;
        /** Visible label for the email input (REQUIRED) */
        emailLabel: string;
        /** Email input placeholder */
        emailPlaceholder?: string;
        /** Submit button text (REQUIRED) */
        submitLabel: string;
        /** Form state */
        state?: "idle" | "submitting" | "success" | "error";
        /** Success message text */
        successMessage?: string;
        /** Error message text */
        errorMessage?: string;
        /** Submit handler */
        onsubmit?: (event: SubmitEvent) => void;
        [key: string]: unknown;
    } = $props();

    let isSubmitting = $derived(state === "submitting");
    let isSuccess = $derived(state === "success");
    let isError = $derived(state === "error");
</script>

<!-- NewsletterSignup.svelte -->
<form
    class={`newsletter-signup ${className}`}
    aria-label={label}
    data-state={state}
    {onsubmit}
    {...restProps}
>
    {#if heading || description}
        <header class="newsletter-signup-header">
            {#if heading}
                <h3 class="newsletter-signup-heading">{heading}</h3>
            {/if}
            {#if description}
                <p class="newsletter-signup-description">{description}</p>
            {/if}
        </header>
    {/if}
    <label class="newsletter-signup-label">
        {emailLabel}
        <input
            class="newsletter-signup-input"
            type="email"
            disabled={isSubmitting}
            placeholder={emailPlaceholder}
        />
    </label>
    <button
        class="newsletter-signup-submit"
        type="submit"
        disabled={isSubmitting}
    >
        {submitLabel}
    </button>
    <p
        class="newsletter-signup-success"
        role="status"
        aria-live="polite"
        hidden={!isSuccess}
    >
        {successMessage ?? ""}
    </p>
    <p
        class="newsletter-signup-error"
        role="alert"
        hidden={!isError}
    >
        {errorMessage ?? ""}
    </p>
</form>
