<script lang="ts">
    // MedicationView component
    //
    // A headless read-only display of a medicine (spec/healthcare-ui item 3): its name, strength, form, route and frequency,
    // each in its own part and none ever truncated. Lily ships no drug data and no tall man list: tall man letters come from
    // the consumer as marked segments of the name, and the consumer formats the strength (formatQuantity writes "5 mg",
    // never "5.0 mg").
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, optional. Hidden text naming the value, when no visible caption does.
    //   name — string, optional. The medicine's name as plain text.
    //   nameSegments — { text: string; tallMan?: boolean }[], optional. The name in parts, with tall man letters marked;
    //     each marked part renders as .medication-view-tall-man for the theme to make bold. Used instead of name.
    //   strength — string, optional. The strength, formatted by the consumer ("25 mg").
    //   form — string, optional. The dose form ("tablet").
    //   route — string, optional. The route ("oral").
    //   frequency — string, optional. How often ("twice daily").
    //   dosageText — string, optional. The dose as free text (FHIR Dosage.text), when the record has no structured parts.
    //   ...restProps — additional HTML attributes spread onto the <span>.
    //
    // Syntax:
    //   <MedicationView nameSegments={[{ text: "hydr" }, { text: "ALAZINE", tallMan: true }]} strength="25 mg"
    //       form="tablet" route="oral" frequency="twice daily" />
    //
    // References:
    //   - ISMP guidelines for safe electronic communication of medication information (2025)
    //   - ISMP Canada, principles for the application of TALLman lettering
    let {
        class: className = "",
        label,
        name = "",
        nameSegments,
        strength,
        form,
        route,
        frequency,
        dosageText,
        ...restProps
    }: {
        label?: string;
        name?: string;
        nameSegments?: { text: string; tallMan?: boolean }[];
        strength?: string;
        form?: string;
        route?: string;
        frequency?: string;
        dosageText?: string;
        [key: string]: unknown;
    } = $props();
</script>

<!-- MedicationView.svelte -->
<span
    class={`medication-view ${className}`}
    {...restProps}
    >{#if label}<span class="screen-reader-span">{`${label} `}</span>{/if}<span
        class="medication-view-name"
        >{#if nameSegments}{#each nameSegments as segment, i (i)}{#if segment.tallMan}<span
                        class="medication-view-tall-man">{segment.text}</span
                    >{:else}{segment.text}{/if}{/each}{:else}{name}{/if}</span
    >{#if strength}{" "}<span class="medication-view-strength">{strength}</span
        >{/if}{#if form}{" "}<span class="medication-view-form">{form}</span
        >{/if}{#if route}{" "}<span class="medication-view-route">{route}</span
        >{/if}{#if frequency}{" "}<span class="medication-view-frequency">{frequency}</span
        >{/if}{#if dosageText}{" "}<span class="medication-view-dosage">{dosageText}</span
        >{/if}</span
>
