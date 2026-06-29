<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const cv = assessment.data.cardiovascularRisk;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Cardiovascular Risk Factors" description="Blood pressure, vascular and cardiac history.">
	<RadioGroup label="Do you have high blood pressure (hypertension)?" name="hypertension" options={yesNo} bind:value={cv.hypertension} />

	<div class="field-grid">
		<NumberInput label="Systolic BP" unit="mmHg" name="systolicBP" min={70} max={260} bind:value={cv.systolicBP} />
		<NumberInput label="Diastolic BP" unit="mmHg" name="diastolicBP" min={40} max={160} bind:value={cv.diastolicBP} />
	</div>
	{#if cv.hypertension === 'yes'}
		<RadioGroup label="Is your blood pressure well controlled?" name="bpControlled" options={yesNo} bind:value={cv.bpControlled} />
	{/if}

	<RadioGroup label="Ischaemic heart disease (angina, heart attack)?" name="ischaemicHeartDisease" options={yesNo} bind:value={cv.ischaemicHeartDisease} />
	<RadioGroup label="History of stroke?" name="strokeHistory" options={yesNo} bind:value={cv.strokeHistory} />

	<RadioGroup label="Valvular heart disease?" name="valvularHeartDisease" options={yesNo} bind:value={cv.valvularHeartDisease} />
	{#if cv.valvularHeartDisease === 'yes'}
		<RadioGroup label="With complications (pulmonary hypertension, AF, endocarditis)?" name="valvularComplications" options={yesNo} bind:value={cv.valvularComplications} />
	{/if}

	<RadioGroup label="High cholesterol (hyperlipidaemia)?" name="hyperlipidaemia" options={yesNo} bind:value={cv.hyperlipidaemia} />
	<RadioGroup label="Family history of venous thromboembolism (DVT/PE) in a first-degree relative?" name="familyHistoryVTE" options={yesNo} bind:value={cv.familyHistoryVTE} />
	<RadioGroup label="Family history of cardiovascular disease?" name="familyHistoryCVD" options={yesNo} bind:value={cv.familyHistoryCVD} />
	{#if cv.familyHistoryCVD === 'yes'}
		<TextInput label="Family CVD details" name="familyCVDDetails" placeholder="e.g. Father MI age 50" bind:value={cv.familyCVDDetails} />
	{/if}
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
