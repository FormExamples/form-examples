<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const tp = assessment.data.treatmentPlan;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const formulationOptions = [
		{ value: 'subcutaneous-weekly', label: 'Subcutaneous (weekly injection)' },
		{ value: 'oral-daily', label: 'Oral (daily tablet)' }
	];
</script>

<Fieldset legend="Treatment Plan">
	<p class="hint">Proposed semaglutide treatment plan and monitoring schedule.</p>

	<Field label="Selected Formulation">
		<RadioGroup label="Selected formulation">
			{#each formulationOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="selectedFormulation" value={opt.value} bind:group={tp.selectedFormulation} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Starting Dose" inputId="startingDose">
		<Select id="startingDose" label="Starting dose" bind:value={tp.startingDose}>
			<option value="">-- Select --</option>
			<option value="0.25mg">0.25 mg (initiation dose)</option>
			<option value="0.5mg">0.5 mg</option>
			<option value="1mg">1 mg</option>
			<option value="3mg-oral">3 mg oral (initiation dose)</option>
			<option value="7mg-oral">7 mg oral</option>
			<option value="14mg-oral">14 mg oral</option>
		</Select>
	</Field>

	<Field label="Titration Schedule" inputId="titrationSchedule">
		<TextInput id="titrationSchedule" label="Titration schedule" placeholder="e.g., Increase dose every 4 weeks per standard protocol" bind:value={tp.titrationSchedule} />
	</Field>

	<Field label="Monitoring Frequency" inputId="monitoringFrequency">
		<Select id="monitoringFrequency" label="Monitoring frequency" bind:value={tp.monitoringFrequency}>
			<option value="">-- Select --</option>
			<option value="Weekly">Weekly</option>
			<option value="Fortnightly">Fortnightly</option>
			<option value="Monthly">Monthly</option>
			<option value="Quarterly">Quarterly</option>
		</Select>
	</Field>

	<Field label="Dietary guidance provided?">
		<RadioGroup label="Dietary guidance">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="dietaryGuidance" value={opt.value} bind:group={tp.dietaryGuidance} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Exercise plan discussed?">
		<RadioGroup label="Exercise plan">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="exercisePlan" value={opt.value} bind:group={tp.exercisePlan} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Follow-up Appointment (weeks)" inputId="followUpWeeks">
		<NumberInput id="followUpWeeks" label="Follow-up weeks" min={1} max={52} step={1} bind:value={tp.followUpWeeks} />
	</Field>
</Fieldset>
