<script lang="ts">
	// LikertGroup — domain-specific (5-point scale) Lily-classed RadioGroup.
	interface LikertOption {
		value: number;
		label: string;
	}
	let {
		label,
		name,
		options,
		value = $bindable<number | null>(null),
		required = false
	}: {
		label: string;
		name: string;
		options: LikertOption[];
		value: number | null;
		required?: boolean;
	} = $props();
</script>

<fieldset class="radio-group" role="radiogroup" aria-label={label}>
	{#each options as opt (opt.value)}
		<label>
			<input
				type="radio"
				class="radio-input"
				{name}
				value={opt.value}
				checked={value === opt.value}
				onchange={() => (value = opt.value)}
				{required}
			/>
			{opt.label}
		</label>
	{/each}
</fieldset>
