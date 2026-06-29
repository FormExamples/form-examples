<script lang="ts">
	import { application } from '$lib/stores/application.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import type { EligibleConditionCode } from '$lib/engine/types';

	const data = application.data;

	const conditionOptions = [
		{
			value: 'permanent-fistula',
			label: '1. Permanent fistula',
			description: 'e.g. caecostomy, colostomy, laryngostomy, ileostomy — needing continuous dressing or appliance.'
		},
		{
			value: 'hypoadrenalism',
			label: '2. Hypoadrenalism',
			description: "e.g. Addison's disease — for which specific substitution therapy is essential."
		},
		{
			value: 'diabetes-insipidus-or-hypopituitarism',
			label: '3. Diabetes insipidus / other hypopituitarism',
			description: ''
		},
		{
			value: 'diabetes-mellitus-not-diet-only',
			label: '4. Diabetes mellitus',
			description: 'except where treatment is by diet alone.'
		},
		{ value: 'hypoparathyroidism', label: '5. Hypoparathyroidism', description: '' },
		{ value: 'myasthenia-gravis', label: '6. Myasthenia gravis', description: '' },
		{
			value: 'myxoedema',
			label: '7. Myxoedema',
			description: 'hypothyroidism requiring thyroid hormone replacement.'
		},
		{
			value: 'epilepsy-on-anticonvulsant',
			label: '8. Epilepsy',
			description: 'requiring continuous anticonvulsive therapy.'
		},
		{
			value: 'continuing-physical-disability',
			label: '9. Continuing physical disability',
			description: 'patient cannot leave home without the help of another person.'
		},
		{
			value: 'cancer-or-effects',
			label: '10. Cancer',
			description: 'undergoing treatment for cancer, the effects of cancer, or the effects of current or previous cancer treatment.'
		}
	];

	const selectedValues = $derived(
		data.qualifyingConditions.filter((c) => c.selected).map((c) => c.code as string)
	);

	function updateSelections(values: string[]) {
		for (const c of data.qualifyingConditions) {
			c.selected = values.includes(c.code as string);
		}
	}

	// Reactive bridge: when the CheckboxGroup writes a new array, mutate selections.
	// eslint-disable-next-line svelte/no-reactive-functions
	let proxyValues = $state<string[]>(
		data.qualifyingConditions.filter((c) => c.selected).map((c) => c.code as string)
	);
	$effect(() => {
		// Sync from store -> proxy when external changes occur.
		const storeCodes = data.qualifyingConditions
			.filter((c) => c.selected)
			.map((c) => c.code as string)
			.sort()
			.join('|');
		const proxyCodes = [...proxyValues].sort().join('|');
		if (storeCodes !== proxyCodes) {
			proxyValues = data.qualifyingConditions
				.filter((c) => c.selected)
				.map((c) => c.code as string);
		}
	});

	$effect(() => {
		updateSelections(proxyValues);
	});
</script>

<Fieldset
	title="Qualifying condition selection"
	description="The NHSBSA recognises exactly ten qualifying conditions. Select every condition that applies to this patient — the practitioner attests to each one selected."
>
	<CheckboxGroup
		label="Qualifying conditions (select all that apply)"
		name="qualifyingConditions"
		options={conditionOptions}
		bind:values={proxyValues}
		required
	/>
</Fieldset>
