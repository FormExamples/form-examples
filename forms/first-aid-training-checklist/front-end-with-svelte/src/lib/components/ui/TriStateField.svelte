<script lang="ts">
	// TriStateField — a Field + RadioGroup pairing for a single competency item.
	//
	// Records the examiner's tri-state observation:
	//   'yes' Demonstrated · 'no' Not yet · 'na' Not assessed.
	// Built from the Lily Svelte headless Field and RadioGroup contracts.
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import type { TriState } from '$lib/engine/types';

	let {
		id,
		label,
		critical = false,
		value = $bindable<TriState>('')
	}: {
		id: string;
		label: string;
		critical?: boolean;
		value?: TriState;
	} = $props();

	const options: { value: TriState; label: string }[] = [
		{ value: 'yes', label: 'Demonstrated' },
		{ value: 'no', label: 'Not yet' },
		{ value: 'na', label: 'Not assessed' }
	];
</script>

<Field label={critical ? `${label} (critical)` : label} inputId={`${id}-yes`}>
	<RadioGroup label={label}>
		{#each options as opt, i (opt.value)}
			<label>
				<input
					type="radio"
					class="radio-input"
					id={i === 0 ? `${id}-yes` : `${id}-${opt.value}`}
					name={id}
					value={opt.value}
					bind:group={value}
				/>
				{opt.label}
			</label>
		{/each}
	</RadioGroup>
</Field>
