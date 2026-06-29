<script lang="ts">
	// Legacy RadioGroup adapted to emit Lily .field + .radio-group + .radio-input markup.
	interface Option {
		value: string;
		label: string;
	}
	let {
		label,
		name,
		options,
		value = $bindable(''),
		required = false,
		stack = false
	}: {
		label: string;
		name: string;
		options: Option[];
		value: string;
		required?: boolean;
		stack?: boolean;
	} = $props();
</script>

<div class="field" data-required={required || undefined}>
	<span class="label" data-required={required || undefined}>{label}</span>
	<fieldset class="radio-group" role="radiogroup" aria-label={label} class:stack>
		{#each options as opt (opt.value)}
			<label>
				<input
					type="radio"
					class="radio-input"
					{name}
					value={opt.value}
					bind:group={value}
					{required}
				/>
				{opt.label}
			</label>
		{/each}
	</fieldset>
</div>

<style>
	.radio-group.stack {
		flex-direction: column;
		align-items: stretch;
	}
</style>
