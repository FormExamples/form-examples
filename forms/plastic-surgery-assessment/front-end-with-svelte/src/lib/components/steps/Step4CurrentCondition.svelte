<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.currentCondition;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const severity = [
		{ value: 'none', label: 'None' },
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' }
	];
</script>

<Fieldset legend="Current Condition Assessment">
	<p class="hint">Describe the presenting condition and its functional impact.</p>

	<Field label="Condition category" inputId="conditionCategory">
		<Select id="conditionCategory" label="Condition category" bind:value={d.conditionCategory}>
			<option value="">Select…</option>
			<option value="skin-lesion">Skin lesion</option>
			<option value="soft-tissue-defect">Soft tissue defect</option>
			<option value="skeletal-deformity">Skeletal deformity</option>
			<option value="burn-injury">Burn injury</option>
			<option value="scar-contracture">Scar contracture</option>
			<option value="nerve-injury">Nerve injury</option>
			<option value="vascular-malformation">Vascular malformation</option>
			<option value="breast">Breast</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Condition description" inputId="conditionDescription">
		<TextAreaInput id="conditionDescription" label="Condition description" rows={3} bind:value={d.conditionDescription} />
	</Field>

	<div class="field-grid field-grid-3">
		<Field label="Lesion length (mm)" inputId="lesionLengthMm">
			<NumberInput id="lesionLengthMm" label="Lesion length" min={0} bind:value={d.lesionLengthMm} />
		</Field>
		<Field label="Lesion width (mm)" inputId="lesionWidthMm">
			<NumberInput id="lesionWidthMm" label="Lesion width" min={0} bind:value={d.lesionWidthMm} />
		</Field>
		<Field label="Lesion depth (mm)" inputId="lesionDepthMm">
			<NumberInput id="lesionDepthMm" label="Lesion depth" min={0} bind:value={d.lesionDepthMm} />
		</Field>
	</div>

	<Field label="Tissue loss present?">
		<RadioGroup label="Tissue loss present?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="tissueLoss" value={opt.value} bind:group={d.tissueLoss} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.tissueLoss === 'yes'}
		<Field label="Tissue loss (% of area)" inputId="tissueLossPercentage">
			<NumberInput id="tissueLossPercentage" label="Tissue loss percentage" min={0} max={100} bind:value={d.tissueLossPercentage} />
		</Field>
	{/if}

	<Field label="Functional impairment" inputId="functionalImpairment">
		<Select id="functionalImpairment" label="Functional impairment" bind:value={d.functionalImpairment}>
			<option value="">Select…</option>
			{#each severity as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>
	{#if d.functionalImpairment !== '' && d.functionalImpairment !== 'none'}
		<Field label="Functional impairment details" inputId="functionalImpairmentDetails">
			<TextInput id="functionalImpairmentDetails" label="Functional impairment details" bind:value={d.functionalImpairmentDetails} />
		</Field>
	{/if}

	<Field label="Pain level (NRS 0–10)" inputId="painLevel">
		<NumberInput id="painLevel" label="Pain level" min={0} max={10} bind:value={d.painLevel} />
	</Field>

	<Field label="Cosmetic concern" inputId="cosmeticConcern">
		<Select id="cosmeticConcern" label="Cosmetic concern" bind:value={d.cosmeticConcern}>
			<option value="">Select…</option>
			{#each severity as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Impact on daily activities" inputId="impactOnDailyActivities">
		<Select id="impactOnDailyActivities" label="Impact on daily activities" bind:value={d.impactOnDailyActivities}>
			<option value="">Select…</option>
			{#each severity as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
