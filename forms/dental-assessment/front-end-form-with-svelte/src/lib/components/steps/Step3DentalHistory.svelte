<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.dentalHistory;
	const anxietyOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' }
	];
</script>

<Fieldset legend="Dental History">
	<p class="hint">Your dental care habits and history.</p>

	<Field label="Date of last dental visit" inputId="lastDentalVisit">
		<DateInput id="lastDentalVisit" label="Last dental visit" bind:value={d.lastDentalVisit} />
	</Field>

	<Field label="How often do you visit the dentist?" inputId="visitFrequency">
		<Select id="visitFrequency" label="Visit frequency" bind:value={d.visitFrequency}>
			<option value="">— Select —</option>
			<option value="every-6-months">Every 6 months</option>
			<option value="annually">Annually</option>
			<option value="rarely">Rarely</option>
			<option value="never">Never</option>
		</Select>
	</Field>

	<Field label="How often do you brush your teeth?" inputId="brushingFrequency">
		<Select id="brushingFrequency" label="Brushing frequency" bind:value={d.brushingFrequency}>
			<option value="">— Select —</option>
			<option value="twice-daily">Twice daily</option>
			<option value="once-daily">Once daily</option>
			<option value="occasionally">Occasionally</option>
			<option value="rarely">Rarely</option>
		</Select>
	</Field>

	<Field label="How often do you floss?" inputId="flossingFrequency">
		<Select id="flossingFrequency" label="Flossing frequency" bind:value={d.flossingFrequency}>
			<option value="">— Select —</option>
			<option value="daily">Daily</option>
			<option value="occasionally">Occasionally</option>
			<option value="rarely">Rarely</option>
			<option value="never">Never</option>
		</Select>
	</Field>

	<Field label="Level of dental anxiety">
		<RadioGroup label="Dental anxiety">
			{#each anxietyOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="dentalAnxietyLevel" value={opt.value} bind:group={d.dentalAnxietyLevel} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
