<script lang="ts">
	// TriStateField — a labelled yes / no / N-A checklist item for the
	// psychomotor examination, built from the Lily Field + RadioGroup contract.
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
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
		{ value: 'yes', label: 'Performed' },
		{ value: 'no', label: 'Not performed' },
		{ value: 'na', label: 'N/A' }
	];
</script>

<Field {label}>
	{#if critical}
		<p class="hint"><span class="font-semibold text-error">Critical criterion</span> — any "Not performed" forces an automatic Fail.</p>
	{/if}
	<RadioGroup label={label}>
		{#each options as opt (opt.value)}
			<label><input type="radio" class="radio-input" {name} value={opt.value} bind:group={value} /> {opt.label}</label>
		{/each}
	</RadioGroup>
</Field>
