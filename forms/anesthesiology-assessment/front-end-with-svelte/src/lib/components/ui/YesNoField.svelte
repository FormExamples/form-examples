<script lang="ts">
	// A compact yes / no (optionally yes / no / unknown) radio field bound to a
	// single string value. Built on the Lily Field + RadioGroup contract.
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	let {
		label,
		name,
		value = $bindable(''),
		withUnknown = false
	}: {
		label: string;
		name: string;
		value?: string;
		withUnknown?: boolean;
	} = $props();

	const options = $derived(
		withUnknown
			? [
					{ value: 'yes', label: 'Yes' },
					{ value: 'no', label: 'No' },
					{ value: 'unknown', label: 'Unknown' }
				]
			: [
					{ value: 'yes', label: 'Yes' },
					{ value: 'no', label: 'No' }
				]
	);
</script>

<Field {label}>
	<RadioGroup {label}>
		{#each options as opt (opt.value)}
			<label>
				<input type="radio" class="radio-input" {name} value={opt.value} bind:group={value} />
				{opt.label}
			</label>
		{/each}
	</RadioGroup>
</Field>
