<script lang="ts">
	// EmailInput — Lily Svelte headless contract.
	let {
		class: className = '',
		label,
		value = $bindable(''),
		required = false,
		disabled = false,
		...restProps
	}: {
		label: string;
		value?: string;
		required?: boolean;
		disabled?: boolean;
		[key: string]: unknown;
	} = $props();
</script>

<input class={`email-input ${className}`} type="email" aria-label={label} bind:value {required} {disabled} {...restProps} />
