<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const m = assessment.data.medicalHistory;
	// Typed view for binding the yes/no condition radios by dynamic key.
	const mv = m as unknown as Record<string, string>;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const conditions: { field: string; label: string }[] = [
		{ field: 'chronicHypertension', label: 'Chronic hypertension?' },
		{ field: 'cardiacDisease', label: 'Cardiac disease?' },
		{ field: 'preExistingDiabetes', label: 'Pre-existing diabetes (Type 1 or Type 2)?' },
		{ field: 'thyroidDisease', label: 'Thyroid disease?' },
		{ field: 'renalDisease', label: 'Renal disease?' },
		{ field: 'epilepsy', label: 'Epilepsy?' },
		{ field: 'asthma', label: 'Asthma?' },
		{ field: 'autoimmuneDisease', label: 'Autoimmune disease (e.g. SLE, APS)?' },
		{ field: 'hivPositive', label: 'HIV positive?' },
		{ field: 'hepatitis', label: 'Hepatitis B or C?' },
		{ field: 'previousVte', label: 'Previous venous thromboembolism (VTE)?' },
		{ field: 'thrombophilia', label: 'Known thrombophilia?' },
		{ field: 'mentalHealthHistory', label: 'History of significant mental illness?' },
		{ field: 'bariatricSurgery', label: 'Previous bariatric surgery?' }
	];
</script>

<Fieldset legend="Medical History">
	<p class="hint">Pre-existing medical conditions affecting pregnancy.</p>

	{#each conditions as c (c.field)}
		<Field label={c.label}>
			<RadioGroup label={c.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={c.field} value={opt.value} bind:group={mv[c.field]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Other medical conditions" inputId="otherMedicalConditions">
		<TextAreaInput id="otherMedicalConditions" label="Other medical conditions" rows={3} placeholder="List any other relevant medical history." bind:value={m.otherMedicalConditions} />
	</Field>
	<Field label="Current medications" inputId="currentMedications">
		<TextAreaInput id="currentMedications" label="Current medications" rows={3} placeholder="Medication, dose, frequency. Include OTC and supplements." bind:value={m.currentMedications} />
	</Field>
</Fieldset>
