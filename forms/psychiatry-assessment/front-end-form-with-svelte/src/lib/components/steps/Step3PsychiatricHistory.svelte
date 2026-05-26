<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const h = assessment.data.psychiatricHistory;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
</script>

<Fieldset legend="Psychiatric History">
	<p class="hint">Previous psychiatric diagnoses and treatment history.</p>

	<Field label="Previous Diagnoses" inputId="previousDiagnoses">
		<TextAreaInput id="previousDiagnoses" label="Previous diagnoses" rows={3} bind:value={h.previousDiagnoses} />
	</Field>

	<Field label="Previous psychiatric hospitalizations?">
		<RadioGroup label="Previous hospitalizations">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="prevHosp" value={opt.value} bind:group={h.previousHospitalizations} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.previousHospitalizations === 'yes'}
		<Field label="Hospitalization Details" inputId="hospDetails">
			<TextAreaInput id="hospDetails" label="Hospitalization details" rows={3} bind:value={h.hospitalizationDetails} />
		</Field>
	{/if}

	<Field label="Previous suicide attempts?">
		<RadioGroup label="Previous suicide attempts">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="prevSuicide" value={opt.value} bind:group={h.previousSuicideAttempts} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.previousSuicideAttempts === 'yes'}
		<Field label="Suicide Attempt Details" inputId="suicideDetails">
			<TextAreaInput id="suicideDetails" label="Suicide attempt details" rows={3} bind:value={h.suicideAttemptDetails} />
		</Field>
	{/if}

	<Field label="History of self-harm?">
		<RadioGroup label="Self-harm history">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="selfHarmHx" value={opt.value} bind:group={h.selfHarmHistory} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.selfHarmHistory === 'yes'}
		<Field label="Self-Harm Details" inputId="selfHarmDetails">
			<TextAreaInput id="selfHarmDetails" label="Self-harm details" rows={3} bind:value={h.selfHarmDetails} />
		</Field>
	{/if}
</Fieldset>
