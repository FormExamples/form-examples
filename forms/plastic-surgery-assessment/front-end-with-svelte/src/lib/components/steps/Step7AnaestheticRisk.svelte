<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.anaestheticRisk;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Anaesthetic Risk Assessment">
	<p class="hint">ASA status and perioperative anaesthetic risk factors.</p>

	<Field label="ASA Physical Status Class" inputId="asaClass">
		<Select id="asaClass" label="ASA Physical Status Class" bind:value={d.asaClass}>
			<option value="">Select…</option>
			<option value="1">ASA I — Normal healthy patient</option>
			<option value="2">ASA II — Mild systemic disease</option>
			<option value="3">ASA III — Severe systemic disease</option>
			<option value="4">ASA IV — Severe disease, constant threat to life</option>
			<option value="5">ASA V — Moribund patient</option>
		</Select>
	</Field>

	<Field label="Previous anaesthetic?">
		<RadioGroup label="Previous anaesthetic?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousAnaesthetic" value={opt.value} bind:group={d.previousAnaesthetic} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Previous anaesthetic complications?">
		<RadioGroup label="Previous anaesthetic complications?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="anaestheticComplications" value={opt.value} bind:group={d.anaestheticComplications} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.anaestheticComplications === 'yes'}
		<Field label="Anaesthetic complication details" inputId="anaestheticComplicationsDetails">
			<TextInput id="anaestheticComplicationsDetails" label="Anaesthetic complication details" bind:value={d.anaestheticComplicationsDetails} />
		</Field>
	{/if}

	<Field label="Difficult airway?">
		<RadioGroup label="Difficult airway?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="difficultAirway" value={opt.value} bind:group={d.difficultAirway} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.difficultAirway === 'yes'}
		<Field label="Difficult airway details" inputId="difficultAirwayDetails">
			<TextInput id="difficultAirwayDetails" label="Difficult airway details" bind:value={d.difficultAirwayDetails} />
		</Field>
	{/if}

	<Field label="Malignant hyperthermia risk?">
		<RadioGroup label="Malignant hyperthermia risk?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="malignantHyperthermiaRisk" value={opt.value} bind:group={d.malignantHyperthermiaRisk} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Family history of anaesthetic problems?">
		<RadioGroup label="Family history of anaesthetic problems?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="familyAnaestheticProblems" value={opt.value} bind:group={d.familyAnaestheticProblems} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.familyAnaestheticProblems === 'yes'}
		<Field label="Family anaesthetic problem details" inputId="familyAnaestheticDetails">
			<TextInput id="familyAnaestheticDetails" label="Family anaesthetic problem details" bind:value={d.familyAnaestheticDetails} />
		</Field>
	{/if}

	<Field label="Smoking status" inputId="smokingStatus">
		<Select id="smokingStatus" label="Smoking status" bind:value={d.smokingStatus}>
			<option value="">Select…</option>
			<option value="current">Current smoker</option>
			<option value="ex-smoker">Ex-smoker</option>
			<option value="never">Never smoked</option>
		</Select>
	</Field>
	{#if d.smokingStatus === 'current' || d.smokingStatus === 'ex-smoker'}
		<Field label="Pack years" inputId="packYears">
			<NumberInput id="packYears" label="Pack years" min={0} bind:value={d.packYears} />
		</Field>
	{/if}

	<Field label="Alcohol consumption" inputId="alcoholConsumption">
		<Select id="alcoholConsumption" label="Alcohol consumption" bind:value={d.alcoholConsumption}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="within-guidelines">Within guidelines</option>
			<option value="above-guidelines">Above guidelines</option>
		</Select>
	</Field>

	<Field label="Recreational drug use?">
		<RadioGroup label="Recreational drug use?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="recreationalDrugs" value={opt.value} bind:group={d.recreationalDrugs} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.recreationalDrugs === 'yes'}
		<Field label="Recreational drug details" inputId="recreationalDrugsDetails">
			<TextInput id="recreationalDrugsDetails" label="Recreational drug details" bind:value={d.recreationalDrugsDetails} />
		</Field>
	{/if}

	<Field label="Obstructive sleep apnoea?">
		<RadioGroup label="Obstructive sleep apnoea?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="obstructiveSleepApnoea" value={opt.value} bind:group={d.obstructiveSleepApnoea} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Anaesthetic preference" inputId="anaestheticPreference">
		<Select id="anaestheticPreference" label="Anaesthetic preference" bind:value={d.anaestheticPreference}>
			<option value="">Select…</option>
			<option value="local">Local</option>
			<option value="regional">Regional</option>
			<option value="general">General</option>
			<option value="sedation">Sedation</option>
			<option value="no-preference">No preference</option>
		</Select>
	</Field>
</Fieldset>
