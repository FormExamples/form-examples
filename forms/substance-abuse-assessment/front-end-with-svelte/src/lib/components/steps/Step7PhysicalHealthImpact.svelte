<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const p = assessment.data.physicalHealthImpact;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const ynu = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'unknown', label: 'Unknown' }
	];
</script>

<Fieldset legend="Physical Health Impact">
	<p class="hint">Physical health complications associated with substance use.</p>

	<Field label="Liver disease?">
		<RadioGroup label="Liver disease?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="liverDisease" value={opt.value} bind:group={p.liverDisease} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.liverDisease === 'yes'}
		<Field label="Liver disease type" inputId="liverDiseaseType">
			<Select id="liverDiseaseType" label="Liver disease type" bind:value={p.liverDiseaseType}>
				<option value="">-- Select --</option>
				<option value="fatty-liver">Fatty liver</option>
				<option value="hepatitis">Hepatitis</option>
				<option value="cirrhosis">Cirrhosis</option>
				<option value="other">Other</option>
			</Select>
		</Field>
	{/if}

	<div class="field-grid field-grid-3">
		<Field label="Hepatitis B" inputId="hepatitisB">
			<Select id="hepatitisB" label="Hepatitis B" bind:value={p.hepatitisB}>
				<option value="">-- Select --</option>
				{#each ynu as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>
		<Field label="Hepatitis C" inputId="hepatitisC">
			<Select id="hepatitisC" label="Hepatitis C" bind:value={p.hepatitisC}>
				<option value="">-- Select --</option>
				{#each ynu as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>
		<Field label="HIV status" inputId="hivStatus">
			<Select id="hivStatus" label="HIV status" bind:value={p.hivStatus}>
				<option value="">-- Select --</option>
				<option value="positive">Positive</option>
				<option value="negative">Negative</option>
				<option value="unknown">Unknown</option>
			</Select>
		</Field>
	</div>

	<Field label="Cardiovascular issues?">
		<RadioGroup label="Cardiovascular issues?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="cardiovascularIssues" value={opt.value} bind:group={p.cardiovascularIssues} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.cardiovascularIssues === 'yes'}
		<Field label="Cardiovascular details" inputId="cardiovascularDetails">
			<TextInput id="cardiovascularDetails" label="Cardiovascular details" bind:value={p.cardiovascularDetails} />
		</Field>
	{/if}

	<Field label="Respiratory issues?">
		<RadioGroup label="Respiratory issues?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="respiratoryIssues" value={opt.value} bind:group={p.respiratoryIssues} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.respiratoryIssues === 'yes'}
		<Field label="Respiratory details" inputId="respiratoryDetails">
			<TextInput id="respiratoryDetails" label="Respiratory details" bind:value={p.respiratoryDetails} />
		</Field>
	{/if}

	<Field label="Gastrointestinal issues?">
		<RadioGroup label="Gastrointestinal issues?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="gastrointestinalIssues" value={opt.value} bind:group={p.gastrointestinalIssues} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.gastrointestinalIssues === 'yes'}
		<Field label="Gastrointestinal details" inputId="gastrointestinalDetails">
			<TextInput id="gastrointestinalDetails" label="Gastrointestinal details" bind:value={p.gastrointestinalDetails} />
		</Field>
	{/if}

	<Field label="Neurological issues?">
		<RadioGroup label="Neurological issues?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="neurologicalIssues" value={opt.value} bind:group={p.neurologicalIssues} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.neurologicalIssues === 'yes'}
		<Field label="Neurological details" inputId="neurologicalDetails">
			<TextInput id="neurologicalDetails" label="Neurological details" bind:value={p.neurologicalDetails} />
		</Field>
	{/if}

	<Field label="Nutritional deficiency?">
		<RadioGroup label="Nutritional deficiency?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="nutritionalDeficiency" value={opt.value} bind:group={p.nutritionalDeficiency} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Chronic pain?">
		<RadioGroup label="Chronic pain?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="chronicPain" value={opt.value} bind:group={p.chronicPain} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.chronicPain === 'yes'}
		<Field label="Chronic pain details" inputId="chronicPainDetails">
			<TextInput id="chronicPainDetails" label="Chronic pain details" bind:value={p.chronicPainDetails} />
		</Field>
	{/if}

	<Field label="Overdose history?">
		<RadioGroup label="Overdose history?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="overdoseHistory" value={opt.value} bind:group={p.overdoseHistory} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.overdoseHistory === 'yes'}
		<div class="field-grid">
			<Field label="Number of overdoses" inputId="overdoseCount">
				<NumberInput id="overdoseCount" label="Number of overdoses" min={0} max={100} bind:value={p.overdoseCount} />
			</Field>
			<Field label="Date of last overdose" inputId="lastOverdoseDate">
				<DateInput id="lastOverdoseDate" label="Date of last overdose" bind:value={p.lastOverdoseDate} />
			</Field>
		</div>
	{/if}
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.field-grid.field-grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.field-grid,
		.field-grid.field-grid-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
