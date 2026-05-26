<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.comorbiditiesSocial;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const smokingOptions = [
		{ value: 'current', label: 'Current Smoker' },
		{ value: 'ex', label: 'Ex-Smoker' },
		{ value: 'never', label: 'Never Smoked' }
	];
</script>

<Fieldset legend="Comorbidities &amp; Social">
	<p class="hint">Other medical conditions, vaccination status, and lifestyle factors.</p>

	<h3 class="section-h">Comorbidities</h3>
	<Field label="Cardiovascular Risk">
		<RadioGroup label="Cardiovascular risk">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="cardiovascularRisk" value={opt.value} bind:group={d.cardiovascularRisk} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.cardiovascularRisk === 'yes'}
		<Field label="Cardiovascular Risk Details" inputId="cardiovascularRiskDetails">
			<TextAreaInput id="cardiovascularRiskDetails" label="Cardiovascular risk details" placeholder="Hypertension, hyperlipidaemia, etc..." bind:value={d.cardiovascularRiskDetails} />
		</Field>
	{/if}

	<Field label="Osteoporosis">
		<RadioGroup label="Osteoporosis">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="osteoporosis" value={opt.value} bind:group={d.osteoporosis} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.osteoporosis === 'yes'}
		<Field label="On Osteoporosis Treatment">
			<RadioGroup label="On treatment">
				{#each yesNoOptions as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="osteoporosisOnTreatment" value={opt.value} bind:group={d.osteoporosisOnTreatment} />{opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Recent Infections">
		<RadioGroup label="Recent infections">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="recentInfections" value={opt.value} bind:group={d.recentInfections} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.recentInfections === 'yes'}
		<Field label="Infection Details" inputId="recentInfectionDetails">
			<TextAreaInput id="recentInfectionDetails" label="Infection details" placeholder="Type, treatment, resolution..." bind:value={d.recentInfectionDetails} />
		</Field>
	{/if}

	<h3 class="section-h">Screening &amp; Vaccination</h3>
	<Field label="TB Screening Performed">
		<RadioGroup label="TB screening">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="tuberculosisScreening" value={opt.value} bind:group={d.tuberculosisScreening} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Vaccinations Up To Date">
		<RadioGroup label="Vaccinations">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="vaccinationStatusUpToDate" value={opt.value} bind:group={d.vaccinationStatusUpToDate} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.vaccinationStatusUpToDate === 'no'}
		<Field label="Vaccination Details" inputId="vaccinationDetails">
			<TextAreaInput id="vaccinationDetails" label="Vaccination details" placeholder="Missing vaccinations..." bind:value={d.vaccinationDetails} />
		</Field>
	{/if}

	<h3 class="section-h">Social History</h3>
	<Field label="Smoking Status">
		<RadioGroup label="Smoking status">
			{#each smokingOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="smoking" value={opt.value} bind:group={d.smoking} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.smoking === 'current' || d.smoking === 'ex'}
		<Field label="Pack Years" inputId="smokingPackYears">
			<NumberInput id="smokingPackYears" label="Pack years" min={0} max={200} bind:value={d.smokingPackYears} />
		</Field>
	{/if}

	<Field label="Exercise Frequency" inputId="exerciseFrequency">
		<Select id="exerciseFrequency" label="Exercise frequency" bind:value={d.exerciseFrequency}>
			<option value="">-- Select --</option>
			<option value="none">None</option>
			<option value="occasional">Occasional</option>
			<option value="regular">Regular (2-3x/week)</option>
			<option value="daily">Daily</option>
		</Select>
	</Field>
</Fieldset>

<style>.section-h { font-weight: 600; margin: 1rem 0 0.5rem; color: var(--color-text); }</style>
