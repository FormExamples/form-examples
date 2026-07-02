<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const med = assessment.data.medication;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 7 of 8 — Medication">
	<p class="hint">Medications that raise cardiovascular risk.</p>

	<Field label="On atypical antipsychotic medication?">
		<RadioGroup label="On atypical antipsychotic medication?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="med-onAtypicalAntipsychotics"
						value={opt.value}
						bind:group={med.onAtypicalAntipsychotics}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="On regular oral corticosteroids?">
		<RadioGroup label="On regular oral corticosteroids?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="med-onCorticosteroids"
						value={opt.value}
						bind:group={med.onCorticosteroids}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
