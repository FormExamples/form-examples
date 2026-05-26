<script lang="ts">
	// RadioGroup — Lily Svelte headless contract.
	//
	// Emits <fieldset class="radio-group" role="radiogroup"> with each option
	// rendered as a labelled .radio-input. Keeps the legacy options[] /
	// required props used by the step components.
	interface Option {
		value: string;
		label: string;
	}
	let {
		label,
		name,
		options,
		value = $bindable(''),
		required = false
	}: {
		label: string;
		name: string;
		options: Option[];
		value: string;
		required?: boolean;
	} = $props();
</script>

<div class="field">
	<span class="label" data-required={required || undefined}>{label}</span>
	<fieldset class="radio-group" role="radiogroup" aria-label={label}>
		{#each options as opt (opt.value)}
			<label>
				<input
					type="radio"
					{name}
					value={opt.value}
					bind:group={value}
					{required}
					class="radio-input"
				/>
				<span>{opt.label}</span>
			</label>
		{/each}
	</fieldset>
</div>
