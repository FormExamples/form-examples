<script lang="ts">
    // DateField component
    //
    // A date asked for as three parts, day, month and year, in a <fieldset> named by its
    // <legend>, with optional helper text and an error message, all linked by generated
    // ids. It suits dates people know by heart, such as a date of birth. The order of the
    // parts and every label are the consumer's: there is no regional or English default.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   label — string, required. The legend, naming the whole date.
    //   dayLabel, monthLabel, yearLabel — string, required. The three parts' labels.
    //   order — "ymd" | "dmy" | "mdy", default "ymd" (ISO 8601). The order of the parts.
    //   value — string, default "". YYYY-MM-DD once all three parts are filled, else "";
    //     bindable via bind:value. A new value fills the parts.
    //   name — string, optional. Base name: the parts are {name}-day, -month, -year.
    //   autocomplete — "bday", optional. A date of birth: the parts autocomplete as bday-day, -month, -year.
    //   description — string, optional. Helper text, linked from the fieldset.
    //   error — string, optional. Error message, linked from the fieldset and announced.
    //   required — boolean, default false. Every part is required.
    //   disabled — boolean, default false. The fieldset and its parts are disabled.
    //   id — string, optional. Base id: the parts are {id}-day, -month, -year.
    //   ...restProps — additional HTML attributes spread onto the <fieldset>.
    //
    // Syntax:
    //   <DateField label="Date of birth" dayLabel="Day" monthLabel="Month" yearLabel="Year" bind:value />
    //
    // Keyboard:
    //   - Tab moves between the parts; each is a native text field
    //
    // Accessibility:
    //   - <fieldset> + <legend> name the group, announced with each part
    //   - <label for> names each part
    //   - aria-describedby on the fieldset links the description and the error
    //   - aria-invalid="true" on each part while an error is shown
    //   - role="alert" on the error paragraph announces it
    //
    // Internationalization:
    //   - Every label is a prop, and the order is a prop: no English, no regional default
    //
    // References:
    //   - WAI Forms Tutorial, grouping controls: https://www.w3.org/WAI/tutorials/forms/grouping/
    //   - ISO 8601 calendar dates (YYYY-MM-DD)

    import { untrack } from "svelte";
    import { warnMissingName } from "../dev-warning";

    type Part = "day" | "month" | "year";

    let {
        class: className = "",
        label,
        dayLabel,
        monthLabel,
        yearLabel,
        order = "ymd",
        value = $bindable(""),
        name = undefined,
        autocomplete = undefined,
        description = undefined,
        error = undefined,
        required = false,
        disabled = false,
        id = undefined,
        ...restProps
    }: {
        /** The legend, naming the whole date. */
        label: string;
        /** The day part's label. */
        dayLabel: string;
        /** The month part's label. */
        monthLabel: string;
        /** The year part's label. */
        yearLabel: string;
        /** The order of the parts. Default "ymd" (ISO 8601). */
        order?: "ymd" | "dmy" | "mdy";
        /** YYYY-MM-DD once all three parts are filled, else "". Bindable. */
        value?: string;
        /** Base name: the parts are {name}-day, {name}-month, {name}-year. */
        name?: string;
        /** "bday" for a date of birth: the parts autocomplete as bday-day, bday-month, bday-year. */
        autocomplete?: "bday";
        /** Helper text, linked from the fieldset. */
        description?: string;
        /** Error message, linked from the fieldset and announced. */
        error?: string;
        /** Every part is required. */
        required?: boolean;
        /** The fieldset and its parts are disabled. */
        disabled?: boolean;
        /** Base id for the parts; auto-generated if omitted. */
        id?: string;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName("DateField", label, restProps["aria-label"], restProps["aria-labelledby"]),
    );

    const uid = $props.id();
    let baseId = $derived(id ?? `date-field-${uid}`);
    let descriptionId = $derived(`${baseId}-desc`);
    let errorId = $derived(`${baseId}-error`);
    let describedBy = $derived(
        [description ? descriptionId : "", error ? errorId : ""].filter(Boolean).join(" ") ||
            undefined,
    );

    /** The parts of a YYYY-MM-DD value, or empty parts for anything else. */
    function split(v: string): Record<Part, string> {
        const m = /^(\d{1,4})-(\d{1,2})-(\d{1,2})$/.exec(v ?? "");
        return m ? { year: m[1], month: m[2], day: m[3] } : { year: "", month: "", day: "" };
    }

    /** YYYY-MM-DD when every part is a number, else "". The calendar check is the consumer's. */
    function join(p: Record<Part, string>): string {
        if (![p.year, p.month, p.day].every((x) => /^\d+$/.test(x))) return "";
        return `${p.year.padStart(4, "0")}-${p.month.padStart(2, "0")}-${p.day.padStart(2, "0")}`;
    }

    let parts = $state(split(value));

    $effect(() => {
        // A value set from outside fills the parts; one the parts produced leaves them as typed.
        const next = value;
        untrack(() => {
            if (next !== join(parts)) parts = split(next);
        });
    });

    function update(part: Part, text: string) {
        parts = { ...parts, [part]: text };
        value = join(parts);
    }

    const labels = $derived({ day: dayLabel, month: monthLabel, year: yearLabel });
    const SEQUENCES: Record<string, Part[]> = {
        ymd: ["year", "month", "day"],
        dmy: ["day", "month", "year"],
        mdy: ["month", "day", "year"],
    };
    const sequence = $derived(SEQUENCES[order] ?? SEQUENCES.ymd);
</script>

<!-- DateField.svelte -->
<fieldset
    class={`date-field ${className}`}
    aria-describedby={describedBy}
    {disabled}
    {...restProps}
>
    <legend>{label}</legend>
    {#each sequence as part (part)}
        <label for={`${baseId}-${part}`}>{labels[part]}</label>
        <input
            class={`date-field-${part}`}
            id={`${baseId}-${part}`}
            name={name ? `${name}-${part}` : undefined}
            type="text"
            inputmode="numeric"
            autocomplete={autocomplete === "bday" ? `bday-${part}` : undefined}
            maxlength={part === "year" ? 4 : 2}
            value={parts[part]}
            oninput={(event) => update(part, event.currentTarget.value)}
            {required}
            aria-invalid={error ? true : undefined}
        />
    {/each}
    {#if description}
        <p id={descriptionId}>{description}</p>
    {/if}
    {#if error}
        <p
            id={errorId}
            role="alert"
        >
            {error}
        </p>
    {/if}
</fieldset>
