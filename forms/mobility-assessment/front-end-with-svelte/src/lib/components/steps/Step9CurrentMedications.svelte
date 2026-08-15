<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import MedicationEntry from '#lib/components/ui/MedicationEntry.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const med = assessment.data.currentMedications;
	const fallRisk = [
		{ value: 'benzodiazepine', label: 'Benzodiazepines' },
		{ value: 'opioid', label: 'Opioids' },
		{ value: 'antihistamine', label: 'Antihistamines' },
		{ value: 'antipsychotic', label: 'Antipsychotics' },
		{ value: 'antihypertensive', label: 'Antihypertensives' },
		{ value: 'diuretic', label: 'Diuretics' },
		{ value: 'sedative', label: 'Sedatives/Hypnotics' },
		{ value: 'antidepressant', label: 'Antidepressants' },
		{ value: 'anticonvulsant', label: 'Anticonvulsants' }
	];

	function toggleClass(val: string) {
		if (med.fallRiskMedications.includes(val)) {
			med.fallRiskMedications = med.fallRiskMedications.filter((v) => v !== val);
		} else {
			med.fallRiskMedications = [...med.fallRiskMedications, val];
		}
	}
</script>

<Fieldset legend="Current Medications">
	<p class="hint">List all current medications, especially those affecting fall risk.</p>

	<Field label="All Current Medications">
		<MedicationEntry bind:medications={med.medications} />
	</Field>

	<Field label="Fall-Risk Medication Classes">
		<CheckboxGroup label="Fall-Risk Medication Classes">
			{#each fallRisk as opt (opt.value)}
				<label>
					<input type="checkbox" class="checkbox-input" checked={med.fallRiskMedications.includes(opt.value)} onchange={() => toggleClass(opt.value)} />
					{opt.label}
				</label>
			{/each}
		</CheckboxGroup>
	</Field>

	<Field label="Recent Medication Changes" inputId="recentMedicationChanges">
		<TextAreaInput id="recentMedicationChanges" label="Recent Medication Changes" rows={3} placeholder="Describe any recent changes to medications..." bind:value={med.recentMedicationChanges} />
	</Field>
</Fieldset>
