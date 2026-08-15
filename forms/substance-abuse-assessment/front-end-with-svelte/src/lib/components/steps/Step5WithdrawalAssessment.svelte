<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const w = assessment.data.withdrawalAssessment;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	type YesNoKey =
		| 'tremor'
		| 'sweating'
		| 'nauseaVomiting'
		| 'seizureHistory'
		| 'deliriumTremensHistory'
		| 'hallucinations';
	const symptomQuestions: { key: YesNoKey; name: string; label: string }[] = [
		{ key: 'tremor', name: 'tremor', label: 'Tremor?' },
		{ key: 'sweating', name: 'sweating', label: 'Sweating?' },
		{ key: 'nauseaVomiting', name: 'nauseaVomiting', label: 'Nausea or vomiting?' },
		{ key: 'seizureHistory', name: 'seizureHistory', label: 'History of withdrawal seizures?' },
		{ key: 'deliriumTremensHistory', name: 'deliriumTremensHistory', label: 'History of delirium tremens (DTs)?' },
		{ key: 'hallucinations', name: 'hallucinations', label: 'Hallucinations?' }
	];
</script>

<Fieldset legend="Withdrawal Assessment">
	<p class="hint">Current and historical withdrawal features and detoxification risk.</p>

	<Field label="Currently in withdrawal?">
		<RadioGroup label="Currently in withdrawal?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="currentlyInWithdrawal" value={opt.value} bind:group={w.currentlyInWithdrawal} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Withdrawal substance" inputId="withdrawalSubstance">
		<Select id="withdrawalSubstance" label="Withdrawal substance" bind:value={w.withdrawalSubstance}>
			<option value="">-- Select --</option>
			<option value="alcohol">Alcohol</option>
			<option value="opioids">Opioids</option>
			<option value="benzodiazepines">Benzodiazepines</option>
			<option value="stimulants">Stimulants</option>
			<option value="multiple">Multiple</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	{#each symptomQuestions as q (q.name)}
		<Field label={q.label}>
			<RadioGroup label={q.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={q.name} value={opt.value} bind:group={w[q.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<div class="field-grid">
		<Field label="Anxiety severity" inputId="anxiety">
			<Select id="anxiety" label="Anxiety severity" bind:value={w.anxiety}>
				<option value="">-- Select --</option>
				<option value="none">None</option>
				<option value="mild">Mild</option>
				<option value="moderate">Moderate</option>
				<option value="severe">Severe</option>
			</Select>
		</Field>
		<Field label="Agitation severity" inputId="agitation">
			<Select id="agitation" label="Agitation severity" bind:value={w.agitation}>
				<option value="">-- Select --</option>
				<option value="none">None</option>
				<option value="mild">Mild</option>
				<option value="moderate">Moderate</option>
				<option value="severe">Severe</option>
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Hours since last drink/drug" inputId="lastDrinkDrugHours">
			<NumberInput id="lastDrinkDrugHours" label="Hours since last drink/drug" min={0} max={1000} bind:value={w.lastDrinkDrugHours} />
		</Field>
		<Field label="Overall withdrawal severity" inputId="withdrawalSeverity">
			<Select id="withdrawalSeverity" label="Overall withdrawal severity" bind:value={w.withdrawalSeverity}>
				<option value="">-- Select --</option>
				<option value="none">None</option>
				<option value="mild">Mild</option>
				<option value="moderate">Moderate</option>
				<option value="severe">Severe</option>
			</Select>
		</Field>
	</div>

	<Field label="Medically supervised detox needed?">
		<RadioGroup label="Medically supervised detox needed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="medicallySupervisedDetoxNeeded" value={opt.value} bind:group={w.medicallySupervisedDetoxNeeded} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
