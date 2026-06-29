<script lang="ts">
	import type { Snippet } from 'svelte';
	let { class: className = '', type = 'button', disabled = false, label = undefined, onclick = undefined, children, ...restProps }: { type?: 'button' | 'submit' | 'reset'; disabled?: boolean; label?: string; onclick?: (event: MouseEvent) => void; children: Snippet; [key: string]: unknown } = $props();
</script>
<button class={`button ${className}`} {type} {disabled} aria-label={label} {onclick} {...restProps}>{@render children?.()}</button>
