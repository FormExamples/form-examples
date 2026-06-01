<script lang="ts">
    let {
        class: className = "",
        src,
        alt,
        loading = undefined,
        ...restProps
    }: {
        src: string;
        alt: string;
        loading?: "lazy" | "eager";
        [key: string]: unknown;
    } = $props();
</script>

<!-- BarcodeImage.svelte -->
<img class={`barcode-image ${className}`} {src} {alt} {loading} {...restProps} />
