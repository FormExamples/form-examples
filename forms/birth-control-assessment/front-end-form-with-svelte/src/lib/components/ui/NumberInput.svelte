<script lang="ts">
	// NumberInput — Lily Svelte headless contract.
	let {
		label,
		name,
		value = $bindable<number | null>(null),
		min,
		max,
		step = 1,
		unit = '',
		required = false
	}: {
		label: string;
		name: string;
		value: number | null;
		min?: number;
		max?: number;
		step?: number;
		unit?: string;
		required?: boolean;
	} = $props();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.value === '') {
			value = null;
		} else {
			const num = Number(target.value);
			value = isNaN(num) ? null : num;
		}
	}
</script>

<div class="field">
	<label class="label" for={name} data-required={required || undefined}>
		{label}{#if unit}<span class="hint"> ({unit})</span>{/if}
	</label>
	<input
		id={name}
		{name}
		type="number"
		{min}
		{max}
		{step}
		{required}
		class="number-input"
		value={value ?? ''}
		oninput={handleInput}
	/>
</div>
