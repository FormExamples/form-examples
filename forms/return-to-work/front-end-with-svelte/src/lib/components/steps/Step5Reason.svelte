<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.diagnosis;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Reason for absence">
	<p class="hint">The clinical reason for the absence and its mechanism.</p>

	<Field label="Primary diagnosis" inputId="primaryDiagnosis">
		<TextInput id="primaryDiagnosis" label="Primary diagnosis" bind:value={d.primaryDiagnosis} />
	</Field>

	<Field label="Diagnosis code (SNOMED CT / ICD-10)" inputId="diagnosisCode">
		<TextInput id="diagnosisCode" label="Diagnosis code" bind:value={d.diagnosisCode} />
	</Field>

	<Field label="Comorbid conditions" inputId="comorbidConditions">
		<TextAreaInput id="comorbidConditions" label="Comorbid conditions" rows={2} bind:value={d.comorbidConditions} />
	</Field>

	<Field label="Mechanism" inputId="mechanism">
		<Select id="mechanism" label="Mechanism" bind:value={d.mechanism}>
			<option value="">-- Select --</option>
			<option value="illness">Illness</option>
			<option value="injury">Injury</option>
			<option value="surgery">Surgery / procedure</option>
			<option value="mental-health">Mental health</option>
			<option value="pregnancy-related">Pregnancy-related</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Was the absence caused by a workplace incident?">
		<RadioGroup label="Was the absence caused by a workplace incident?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="workplaceCause" value={opt.value} bind:group={d.workplaceCause} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.workplaceCause === 'yes'}
		<Field label="RIDDOR reference (if reported)" inputId="riddorReference">
			<TextInput id="riddorReference" label="RIDDOR reference" bind:value={d.riddorReference} />
		</Field>
	{/if}
</Fieldset>
