<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const m = assessment.data.medicalHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const yesNoUnknown = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'unknown', label: 'Unknown' }
	];
</script>

<Fieldset legend="Medical History">
	<p class="hint">Chronic illness, medications, allergies, surgery, and exertional risk conditions.</p>

	<Field label="Any chronic illness?">
		<RadioGroup label="Any chronic illness?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="chronicIllness" value={opt.value} bind:group={m.chronicIllness} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.chronicIllness === 'yes'}
		<Field label="Chronic illness details" inputId="chronicIllnessDetails">
			<TextAreaInput id="chronicIllnessDetails" label="Chronic illness details" rows={2} bind:value={m.chronicIllnessDetails} />
		</Field>
	{/if}

	<Field label="Currently taking any medications?">
		<RadioGroup label="Currently taking any medications?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="currentMedications" value={opt.value} bind:group={m.currentMedications} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.currentMedications === 'yes'}
		<Field label="Medication details" inputId="currentMedicationDetails">
			<TextAreaInput id="currentMedicationDetails" label="Medication details" rows={2} bind:value={m.currentMedicationDetails} />
		</Field>
	{/if}

	<Field label="Any known allergies?">
		<RadioGroup label="Any known allergies?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="allergiesKnown" value={opt.value} bind:group={m.allergiesKnown} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.allergiesKnown === 'yes'}
		<Field label="Allergy details" inputId="allergyDetails">
			<TextAreaInput id="allergyDetails" label="Allergy details" rows={2} bind:value={m.allergyDetails} />
		</Field>
	{/if}

	<Field label="Any prior surgery?">
		<RadioGroup label="Any prior surgery?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="priorSurgery" value={opt.value} bind:group={m.priorSurgery} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.priorSurgery === 'yes'}
		<Field label="Prior surgery details" inputId="priorSurgeryDetails">
			<TextAreaInput id="priorSurgeryDetails" label="Prior surgery details" rows={2} bind:value={m.priorSurgeryDetails} />
		</Field>
	{/if}

	<Field label="Hospitalised in the last 12 months?">
		<RadioGroup label="Hospitalised in the last 12 months?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hospitalisedLastYear" value={opt.value} bind:group={m.hospitalisedLastYear} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Asthma or exercise-induced bronchospasm?">
		<RadioGroup label="Asthma or exercise-induced bronchospasm?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="asthma" value={opt.value} bind:group={m.asthmaOrExerciseInducedBronchospasm} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Diabetes?">
		<RadioGroup label="Diabetes?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="diabetes" value={opt.value} bind:group={m.diabetes} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Sickle cell trait or disease?">
		<RadioGroup label="Sickle cell trait or disease?">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="sickleCell" value={opt.value} bind:group={m.sickleCellTraitOrDisease} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="History of heat illness?">
		<RadioGroup label="History of heat illness?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="heatIllness" value={opt.value} bind:group={m.heatIllnessHistory} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="History of an eating disorder?">
		<RadioGroup label="History of an eating disorder?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="eatingDisorder" value={opt.value} bind:group={m.eatingDisorderHistory} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
