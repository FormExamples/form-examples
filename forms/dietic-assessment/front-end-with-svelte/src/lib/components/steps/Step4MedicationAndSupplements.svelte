<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS } from '$lib/config/options';
	import { assessmentStore } from '$lib/stores/assessment.svelte';

	const d = assessmentStore.data;
</script>

<Fieldset legend="4. Medication and Supplement Check">
	<p class="hint">Prescription medicines, over-the-counter medicines, vitamins, minerals, and herbal products.</p>

	<Field label="Prescription medicines" inputId="medication-takesPrescriptionMedicines">
		<Select id="medication-takesPrescriptionMedicines" label="Prescription medicines" bind:value={d.medication.takesPrescriptionMedicines}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Over-the-counter medicines" inputId="medication-takesOverTheCounterMedicines">
		<Select id="medication-takesOverTheCounterMedicines" label="Over-the-counter medicines" bind:value={d.medication.takesOverTheCounterMedicines}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Vitamin supplements" inputId="medication-takesVitaminSupplements">
		<Select id="medication-takesVitaminSupplements" label="Vitamin supplements" bind:value={d.medication.takesVitaminSupplements}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Mineral supplements" inputId="medication-takesMineralSupplements">
		<Select id="medication-takesMineralSupplements" label="Mineral supplements" bind:value={d.medication.takesMineralSupplements}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Herbal or complementary products" inputId="medication-takesHerbalProducts">
		<Select id="medication-takesHerbalProducts" label="Herbal or complementary products" bind:value={d.medication.takesHerbalProducts}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Oral nutritional supplements" inputId="medication-takesOralNutritionalSupplements">
		<Select id="medication-takesOralNutritionalSupplements" label="Oral nutritional supplements" bind:value={d.medication.takesOralNutritionalSupplements}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Oral nutritional supplement detail" inputId="medication-oralNutritionalSupplementDetail">
		<TextAreaInput id="medication-oralNutritionalSupplementDetail" label="Oral nutritional supplement detail" rows={2}
			placeholder="Product, dose, and how well it is tolerated." bind:value={d.medication.oralNutritionalSupplementDetail} />
	</Field>
	<Field label="Enteral tube feeding in place" inputId="medication-enteralNutrition">
		<Select id="medication-enteralNutrition" label="Enteral tube feeding in place" bind:value={d.medication.enteralNutrition}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Enteral route" inputId="medication-enteralRoute">
		<Select id="medication-enteralRoute" label="Enteral route" bind:value={d.medication.enteralRoute}>
			<option value="">— Select —</option>
			{#each OPTIONS.enteralRoute as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Tube or tolerance problem" inputId="medication-enteralTubeProblem">
		<Select id="medication-enteralTubeProblem" label="Tube or tolerance problem" bind:value={d.medication.enteralTubeProblem}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Parenteral nutrition" inputId="medication-parenteralNutrition">
		<Select id="medication-parenteralNutrition" label="Parenteral nutrition" bind:value={d.medication.parenteralNutrition}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Drug-nutrient interaction identified" inputId="medication-drugNutrientInteraction">
		<Select id="medication-drugNutrientInteraction" label="Drug-nutrient interaction identified" bind:value={d.medication.drugNutrientInteraction}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Interaction detail" inputId="medication-drugNutrientInteractionDetail">
		<TextInput id="medication-drugNutrientInteractionDetail" label="Interaction detail" bind:value={d.medication.drugNutrientInteractionDetail} />
	</Field>
	<Field label="Adherence" inputId="medication-medicationAdherence">
		<Select id="medication-medicationAdherence" label="Adherence" bind:value={d.medication.medicationAdherence}>
			<option value="">— Select —</option>
			{#each OPTIONS.adherence as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Medication notes" inputId="medication-medicationNotes">
		<TextAreaInput id="medication-medicationNotes" label="Medication notes" rows={2} bind:value={d.medication.medicationNotes} />
	</Field>
</Fieldset>
