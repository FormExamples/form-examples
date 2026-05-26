<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const r = assessment.data.riskFactors;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Risk Factors">
	<p class="hint">Hypertension, diabetes, hyperlipidaemia, family history, obesity.</p>

	<Field label="Do you have high blood pressure (hypertension)?">
		<RadioGroup label="Do you have high blood pressure (hypertension)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="htn" value={opt.value} bind:group={r.hypertension} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.hypertension === 'yes'}
		<Field label="Is it well controlled with medication?" required>
			<RadioGroup label="Is it well controlled with medication?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="htnCtrl" value={opt.value} bind:group={r.hypertensionControlled} required /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Do you have diabetes?">
		<RadioGroup label="Do you have diabetes?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="diabetes" value={opt.value} bind:group={r.diabetes} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.diabetes === 'yes'}
		<Field label="Type of diabetes" inputId="diabetesType">
			<Select id="diabetesType" label="Type of diabetes" bind:value={r.diabetesType}>
				<option value="">-- Select --</option>
				<option value="type1">Type 1</option>
				<option value="type2">Type 2</option>
			</Select>
		</Field>
	{/if}

	<Field label="Do you have high cholesterol (hyperlipidaemia)?">
		<RadioGroup label="Do you have high cholesterol (hyperlipidaemia)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="lipid" value={opt.value} bind:group={r.hyperlipidaemia} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Is there a family history of premature cardiovascular disease?">
		<RadioGroup label="Is there a family history of premature cardiovascular disease?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="famHx" value={opt.value} bind:group={r.familyHistory} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if r.familyHistory === 'yes'}
		<Field label="Family history details" inputId="famHxDetails">
			<TextInput id="famHxDetails" label="Family history details" placeholder="e.g. Father had MI at age 45" bind:value={r.familyHistoryDetails} />
		</Field>
	{/if}

	<Field label="Are you obese (BMI >= 30)?">
		<RadioGroup label="Are you obese (BMI >= 30)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="obesity" value={opt.value} bind:group={r.obesity} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
