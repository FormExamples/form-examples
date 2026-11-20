<script lang="ts">
    // Test host: binds DateField's value and shows it, so a test can read what the parts produce.
    import { untrack } from "svelte";
    import DateField from "./DateField.svelte";

    let {
        value = "",
        yearLabel,
        ...props
    }: { value?: string; yearLabel: string; [key: string]: unknown } = $props();
    // The host starts from the first value only; later changes come from the field.
    let bound = $state(untrack(() => value));
</script>

<DateField
    label="Onset"
    {yearLabel}
    {...props}
    bind:value={bound}
/>
<output data-testid="value">{bound}</output>
