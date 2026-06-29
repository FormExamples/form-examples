<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import MedicationEntry from '$lib/components/ui/MedicationEntry.svelte';

	const d = assessment.data.medicationsSymptomControl;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Medications & Symptom Control Plan">
	<p class="hint">Current regular and as-needed medications, anticipatory prescribing, and the overall control plan.</p>

	<Field label="Regular medications" description="Name, dose, route, frequency, indication">
		<MedicationEntry bind:medications={d.regularMedications} addLabel="Add regular medication" />
	</Field>

	<Field label="As-needed (PRN) medications" description="Name, dose, route, frequency, indication">
		<MedicationEntry bind:medications={d.asNeededMedications} addLabel="Add as-needed medication" />
	</Field>

	<Field label="Syringe driver in use?">
		<RadioGroup label="Syringe driver in use?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="syringeDriverInUse" value={opt.value} bind:group={d.syringeDriverInUse} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.syringeDriverInUse === 'yes'}
		<Field label="Syringe driver details" inputId="syringeDriverDetails">
			<TextAreaInput id="syringeDriverDetails" label="Syringe driver details" rows={2} placeholder="e.g. Morphine + midazolam + levomepromazine" bind:value={d.syringeDriverDetails} />
		</Field>
	{/if}

	<Field label="Anticipatory medications prescribed?">
		<RadioGroup label="Anticipatory medications prescribed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="anticipatoryMedsPrescribed" value={opt.value} bind:group={d.anticipatoryMedsPrescribed} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.anticipatoryMedsPrescribed === 'yes'}
		<Field label="Anticipatory medications notes" inputId="anticipatoryMedsNotes">
			<TextAreaInput id="anticipatoryMedsNotes" label="Anticipatory medications notes" rows={2} bind:value={d.anticipatoryMedsNotes} />
		</Field>
	{/if}

	<Field label="Overall symptom control" inputId="symptomControlOverall">
		<Select id="symptomControlOverall" label="Overall symptom control" bind:value={d.symptomControlOverall}>
			<option value="">-- Select --</option>
			<option value="good">Good</option>
			<option value="partial">Partial</option>
			<option value="poor">Poor</option>
		</Select>
	</Field>

	<Field label="Barriers to symptom control" inputId="barriersToControl">
		<TextAreaInput id="barriersToControl" label="Barriers to symptom control" rows={2} bind:value={d.barriersToControl} />
	</Field>

	<Field label="Plan notes" inputId="planNotes">
		<TextAreaInput id="planNotes" label="Plan notes" rows={2} bind:value={d.planNotes} />
	</Field>
</Fieldset>
