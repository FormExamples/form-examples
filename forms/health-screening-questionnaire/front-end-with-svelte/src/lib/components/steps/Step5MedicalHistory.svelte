<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { YES_NO } from '$lib/config/options';
	import { questionnaireStore } from '$lib/stores/questionnaire.svelte';

	const d = questionnaireStore.data;
</script>

<Fieldset legend="5. Medical History">
	<p class="hint">Diagnosed chronic conditions, past surgeries, current medications, and known drug allergies.</p>

	<Field label="Diabetes" inputId="medicalHistory-conditionDiabetes">
		<Select id="medicalHistory-conditionDiabetes" label="Diabetes" bind:value={d.medicalHistory.conditionDiabetes}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Hypertension" inputId="medicalHistory-conditionHypertension">
		<Select id="medicalHistory-conditionHypertension" label="Hypertension" bind:value={d.medicalHistory.conditionHypertension}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Asthma" inputId="medicalHistory-conditionAsthma">
		<Select id="medicalHistory-conditionAsthma" label="Asthma" bind:value={d.medicalHistory.conditionAsthma}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Chronic obstructive pulmonary disease" inputId="medicalHistory-conditionCopd">
		<Select id="medicalHistory-conditionCopd" label="Chronic obstructive pulmonary disease" bind:value={d.medicalHistory.conditionCopd}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Heart disease" inputId="medicalHistory-conditionHeartDisease">
		<Select id="medicalHistory-conditionHeartDisease" label="Heart disease" bind:value={d.medicalHistory.conditionHeartDisease}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Kidney disease" inputId="medicalHistory-conditionKidneyDisease">
		<Select id="medicalHistory-conditionKidneyDisease" label="Kidney disease" bind:value={d.medicalHistory.conditionKidneyDisease}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Thyroid condition" inputId="medicalHistory-conditionThyroid">
		<Select id="medicalHistory-conditionThyroid" label="Thyroid condition" bind:value={d.medicalHistory.conditionThyroid}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Other diagnosed condition" inputId="medicalHistory-conditionOther">
		<TextAreaInput id="medicalHistory-conditionOther" label="Other diagnosed condition" rows={2} bind:value={d.medicalHistory.conditionOther} />
	</Field>
	<Field label="Past surgeries" inputId="medicalHistory-pastSurgeries">
		<TextAreaInput id="medicalHistory-pastSurgeries" label="Past surgeries" rows={2} bind:value={d.medicalHistory.pastSurgeries} />
	</Field>
	<Field label="Current medications" inputId="medicalHistory-currentMedications">
		<TextAreaInput id="medicalHistory-currentMedications" label="Current medications" rows={2} bind:value={d.medicalHistory.currentMedications} />
	</Field>
	<Field label="Known drug allergies" inputId="medicalHistory-knownDrugAllergies">
		<TextAreaInput id="medicalHistory-knownDrugAllergies" label="Known drug allergies" rows={2} bind:value={d.medicalHistory.knownDrugAllergies} />
	</Field>
</Fieldset>
