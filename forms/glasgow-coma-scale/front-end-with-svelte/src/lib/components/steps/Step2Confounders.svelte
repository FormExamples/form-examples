<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const cf = assessment.data.confounders;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const items: { key: 'intubated' | 'sedated' | 'paralysed'; label: string }[] = [
		{ key: 'intubated', label: 'Intubated or tracheostomy' },
		{ key: 'sedated', label: 'Sedated' },
		{ key: 'paralysed', label: 'Neuromuscular blockade (paralysed)' }
	];
</script>

<Fieldset legend="Step 2 of 8 — Confounders">
	<p class="hint">
		Confounders that may make a component not testable (NT). An intubated verbal response is
		reported with the "T" convention (e.g. GCS &ge; 8 shown as "8T").
	</p>

	{#each items as item (item.key)}
		<Field label={item.label}>
			<RadioGroup label={item.label}>
				{#each yesNo as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name={`confounders-${item.key}`}
							value={opt.value}
							bind:group={cf[item.key]}
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}
</Fieldset>
