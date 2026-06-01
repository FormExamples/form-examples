<script lang="ts">
    // ProgressBar component
    // A horizontal progress indicator.


    let {
        class: className = "",
        label,
        value,
        min = 0,
        max = 100,
        ...restProps
    }: {
        label: string;
        value: number;
        min?: number;
        max?: number;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ProgressBar.svelte -->
<div
    class={`progress-bar ${className}`}
    role="progressbar"
    aria-valuenow={value}
    aria-valuemin={min}
    aria-valuemax={max}
    aria-label={label}
    {...restProps}
></div>
