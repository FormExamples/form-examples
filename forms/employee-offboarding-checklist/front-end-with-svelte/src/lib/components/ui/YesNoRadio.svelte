<script lang="ts">
	// YesNoRadio — a thin composition over the Lily RadioGroup contract for the
	// Yes / No (/ N/A) confirmation fields that make up the offboarding checklist.
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	let {
		label,
		name,
		value = $bindable(''),
		includeNa = false,
		required = false
	}: {
		label: string;
		name: string;
		value?: string;
		includeNa?: boolean;
		required?: boolean;
	} = $props();

	const options = $derived(
		includeNa
			? [
					{ value: 'yes', label: 'Yes' },
					{ value: 'no', label: 'No' },
					{ value: 'na', label: 'N/A' }
				]
			: [
					{ value: 'yes', label: 'Yes' },
					{ value: 'no', label: 'No' }
				]
	);
</script>

<RadioGroup {label}>
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
</RadioGroup>
