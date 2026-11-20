<script lang="ts">
    // SignaturePad: a signature, captured by drawing or by typing a name, with the consumer's attestation and its outcome
    // (spec/lessons/zoblocks item 6, tasks.md P31-T5).
    //
    // Accessibility:
    //   - A named group (role="group"), not role="application": a screen reader keeps its own keys, and the consumer's
    //     drawing surface inside handles its own pointer and key input.
    //   - The attestation ("I confirm that…") is the group's accessible description (aria-describedby).
    //   - typedNameLabel adds a labelled text field, so a signature can be given by keyboard alone (WCAG 2.1.1); drawing is
    //     never the only way.
    //   - outcome other than "signed" is a notice in the consumer's words (declined, unable, verbal, on paper, pending,
    //     revoked), never an empty line. Rendered as data-outcome.
    //
    // Internationalization: every string is the consumer's; no default text.
    // Headless: no CSS; no drawing logic, no hashing (the consumer's).
    import type { Snippet } from "svelte";
    import { warnMissingName, warnMissingProp } from "../dev-warning";

    let {
        class: className = "",
        label,
        attestation = undefined,
        outcome = undefined,
        outcomeLabel = undefined,
        typedNameLabel = undefined,
        typedName = $bindable(""),
        name = undefined,
        children,
        ...restProps
    }: {
        /** The group's accessible name ("Signature of the person giving consent"). */
        label: string;
        /** What the signer confirms, in the consumer's words; shown first and the group's accessible description. */
        attestation?: string;
        /** The signature's outcome; rendered as data-outcome, with outcomeLabel as its words. */
        outcome?: "signed" | "declined" | "unable" | "verbal" | "on-paper" | "pending" | "revoked";
        /** The outcome in the consumer's words ("Declined to sign", "Signed on paper, scanned"); required with outcome. */
        outcomeLabel?: string;
        /** Adds a typed-name field with this label, so a signature can be given by keyboard alone. */
        typedNameLabel?: string;
        /** The typed name. Bindable. */
        typedName?: string;
        /** The typed-name field's form name. */
        name?: string;
        /** The drawing surface (canvas, SVG) or nothing; the consumer's. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    const uid = $props.id();
    const attestationId = `signature-pad-attestation-${uid}`;
    const typedId = `signature-pad-typed-${uid}`;

    $effect(() =>
        warnMissingName(
            "SignaturePad",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );

    $effect(() => {
        if (outcome)
            warnMissingProp(
                "SignaturePad",
                "outcomeLabel",
                outcomeLabel,
                "a signature's outcome needs words, never an empty line.",
            );
    });
</script>

<!-- SignaturePad.svelte -->
<div
    class={`signature-pad ${className}`}
    role="group"
    aria-label={label}
    aria-describedby={attestation ? attestationId : undefined}
    data-outcome={outcome}
    {...restProps}
>
    {#if attestation}<p
            class="signature-pad-attestation"
            id={attestationId}
        >
            {attestation}
        </p>{/if}
    {@render children?.()}
    {#if typedNameLabel}<p class="signature-pad-typed">
            <label for={typedId}>{typedNameLabel}</label>
            <input
                id={typedId}
                type="text"
                autocomplete="name"
                {name}
                bind:value={typedName}
            />
        </p>{/if}
    {#if outcome && outcomeLabel}<p class="signature-pad-outcome">{outcomeLabel}</p>{/if}
</div>
