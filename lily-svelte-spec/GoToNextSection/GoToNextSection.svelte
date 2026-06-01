<script lang="ts">
    // GoToNextSection component
    // A link that takes users to the next section of the current page.


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

<!-- GoToNextSection.svelte -->
<a
    class={`go-to-next-section ${className}`}
    {href}
    aria-label={label}
    {...restProps}
>{label}</a>
