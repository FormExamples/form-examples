<script lang="ts">
    // GoToPreviousSection component
    // A link that takes users to the previous section of the current page.


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
</script>

<!-- GoToPreviousSection.svelte -->
<a
    class={`go-to-previous-section ${className}`}
    {href}
    aria-label={label}
    {...restProps}
>{label}</a>
