<script lang="ts">
	// TriStateField — a competency line item recorded as Demonstrated / Not yet /
	// Not assessed. Wraps the Lily Field + RadioGroup contract so each lifeguard
	// rule maps to a single, accessible tri-state control.
	import Field from './Field.svelte';
	import RadioGroup from './RadioGroup.svelte';
	import type { TriState } from '#lib/engine/types.js';

	let {
		label,
		name,
		value = $bindable<TriState>(''),
		critical = false
	}: {
		label: string;
		name: string;
		value?: TriState;
		critical?: boolean;
	} = $props();

	const options: { value: TriState; label: string }[] = [
		{ value: 'yes', label: 'Demonstrated' },
		{ value: 'no', label: 'Not yet' },
		{ value: 'na', label: 'Not assessed' }
	];
</script>

<Field label={critical ? `${label} (critical)` : label}>
	<RadioGroup label={label}>
		{#each options as opt (opt.value)}
			<label>
				<input type="radio" class="radio-input" {name} value={opt.value} bind:group={value} />
				{opt.label}
			</label>
		{/each}
	</RadioGroup>
</Field>
