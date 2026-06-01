<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        open = false,
        children,
        ...restProps
    }: {
        label?: string;
        open?: boolean;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- TimeoutDialog.svelte -->
<dialog
    class={`timeout-dialog ${className}`}
    role="alertdialog"
    aria-label={label}
    {open}
    {...restProps}
>
    {@render children?.()}
</dialog>
