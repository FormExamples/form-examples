<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.diseaseHistory;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Disease History">
	<p class="hint">Rheumatological diagnosis and treatment history.</p>

	<Field label="Primary Diagnosis" required inputId="primaryDiagnosis">
		<Select id="primaryDiagnosis" label="Primary diagnosis" required bind:value={d.primaryDiagnosis}>
			<option value="">-- Select --</option>
			<option value="rheumatoid-arthritis">Rheumatoid Arthritis</option>
			<option value="psoriatic-arthritis">Psoriatic Arthritis</option>
			<option value="ankylosing-spondylitis">Ankylosing Spondylitis</option>
			<option value="systemic-lupus">Systemic Lupus Erythematosus</option>
			<option value="gout">Gout</option>
			<option value="osteoarthritis">Osteoarthritis</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Date of Diagnosis" inputId="diagnosisDate">
		<DateInput id="diagnosisDate" label="Date of diagnosis" bind:value={d.diagnosisDate} />
	</Field>

	<Field label="Disease Duration (years)" inputId="diseaseDurationYears">
		<NumberInput id="diseaseDurationYears" label="Disease duration" min={0} max={80} bind:value={d.diseaseDurationYears} />
	</Field>

	<Field label="Previous DMARDs" inputId="previousDMARDs">
		<TextAreaInput id="previousDMARDs" label="Previous DMARDs" placeholder="e.g., Methotrexate, Sulfasalazine, Hydroxychloroquine..." bind:value={d.previousDMARDs} />
	</Field>

	<Field label="Previous Biologics" inputId="previousBiologics">
		<TextAreaInput id="previousBiologics" label="Previous biologics" placeholder="e.g., Adalimumab, Etanercept, Rituximab..." bind:value={d.previousBiologics} />
	</Field>

	<Field label="Any Remission Periods?">
		<RadioGroup label="Remission periods">
			{#each yesNoOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="remissionPeriods" value={opt.value} bind:group={d.remissionPeriods} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.remissionPeriods === 'yes'}
		<Field label="Remission Details" inputId="remissionDetails">
			<TextAreaInput id="remissionDetails" label="Remission details" placeholder="Duration, how achieved, any relapses..." bind:value={d.remissionDetails} />
		</Field>
	{/if}
</Fieldset>
