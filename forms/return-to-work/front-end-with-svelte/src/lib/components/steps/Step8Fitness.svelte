<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const fs = assessment.data.fitness;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Fitness statement">
	<p class="hint">The clinician's overall determination and the validity period.</p>

	<Field label="Overall outcome" inputId="fitnessOutcome" required>
		<Select id="fitnessOutcome" label="Overall outcome" bind:value={fs.outcome} required>
			<option value="">-- Select --</option>
			<option value="fit">Fit for work</option>
			<option value="may-be-fit">May be fit for work — with adjustments</option>
			<option value="not-fit">Not fit for work</option>
		</Select>
	</Field>

	<Field label="Clinician confidence" inputId="clinicianConfidence">
		<Select id="clinicianConfidence" label="Clinician confidence" bind:value={fs.clinicianConfidence}>
			<option value="">-- Select --</option>
			<option value="high">High</option>
			<option value="medium">Medium</option>
			<option value="low">Low</option>
		</Select>
	</Field>

	<Field label="Valid from" inputId="validFrom">
		<DateInput id="validFrom" label="Valid from" bind:value={fs.validFrom} />
	</Field>

	<Field label="Valid to (end date)" inputId="validTo">
		<DateInput id="validTo" label="Valid to" bind:value={fs.validTo} />
	</Field>

	<Field label="Or number of weeks" inputId="validWeeks">
		<NumberInput id="validWeeks" label="Number of weeks" min={0} max={52} bind:value={fs.validWeeks} />
	</Field>

	<Field label="Reassessment required at expiry?">
		<RadioGroup label="Reassessment required at expiry?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="reassessmentRequired" value={opt.value} bind:group={fs.reassessmentRequired} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
