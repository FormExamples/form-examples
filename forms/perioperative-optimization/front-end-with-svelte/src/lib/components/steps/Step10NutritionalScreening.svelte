<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO_OPTS } from '#lib/config/options.js';
	import { assessmentStore } from '#lib/stores/assessment.svelte.js';

	const d = assessmentStore.data;
	const result = $derived(assessmentStore.result);
</script>

<Fieldset legend="10. Nutritional Screening">
	<p class="hint">Domain 5. MUST is computed from body mass index, unintentional weight loss, and the acute disease effect.</p>

	<Field label="Height (cm)" inputId="nutrition-heightAsCm">
		<NumberInput id="nutrition-heightAsCm" label="Height (cm)" min={50} max={250} step="0.1" bind:value={d.nutrition.heightAsCm} />
	</Field>
	<Field label="Weight (kg)" inputId="nutrition-weightAsKg">
		<NumberInput id="nutrition-weightAsKg" label="Weight (kg)" min={15} max={400} step="0.1" bind:value={d.nutrition.weightAsKg} />
	</Field>
	<Field label="Usual weight (kg)" inputId="nutrition-usualWeightAsKg">
		<NumberInput id="nutrition-usualWeightAsKg" label="Usual weight (kg)" min={15} max={400} step="0.1" bind:value={d.nutrition.usualWeightAsKg} />
	</Field>
	<Field label="Body mass index" inputId="nutrition-bmi" description="Computed from height and weight.">
		<TextInput id="nutrition-bmi" label="Body mass index" value={result.bmi === null ? "—" : `${result.bmi} kg/m²`} readonly />
	</Field>
	<Field label="Unintentional weight loss" inputId="nutrition-weightLossPercent" description="Computed against the usual weight.">
		<TextInput id="nutrition-weightLossPercent" label="Unintentional weight loss" value={result.weightLossPercent === null ? "—" : `${result.weightLossPercent}%`} readonly />
	</Field>
	<Field label="Was the weight loss intentional" inputId="nutrition-weightLossIsIntentional" description="Only unplanned loss scores in MUST.">
		<Select id="nutrition-weightLossIsIntentional" label="Was the weight loss intentional" bind:value={d.nutrition.weightLossIsIntentional}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Acutely ill" inputId="nutrition-acutelyIll">
		<Select id="nutrition-acutelyIll" label="Acutely ill" bind:value={d.nutrition.acutelyIll}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="No nutritional intake likely for more than 5 days" inputId="nutrition-noNutritionalIntakeOver5Days">
		<Select id="nutrition-noNutritionalIntakeOver5Days" label="No nutritional intake likely for more than 5 days" bind:value={d.nutrition.noNutritionalIntakeOver5Days}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Appetite" inputId="nutrition-appetite">
		<Select id="nutrition-appetite" label="Appetite" bind:value={d.nutrition.appetite}>
			<option value="">— Select —</option>
			{#each OPTIONS.appetite as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Oral nutritional supplements" inputId="nutrition-oralNutritionalSupplements">
		<Select id="nutrition-oralNutritionalSupplements" label="Oral nutritional supplements" bind:value={d.nutrition.oralNutritionalSupplements}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Immunonutrition" inputId="nutrition-immunonutrition">
		<Select id="nutrition-immunonutrition" label="Immunonutrition" bind:value={d.nutrition.immunonutrition}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Dietitian referral" inputId="nutrition-dietitianReferral">
		<Select id="nutrition-dietitianReferral" label="Dietitian referral" bind:value={d.nutrition.dietitianReferral}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Nutrition notes" inputId="nutrition-nutritionNotes">
		<TextAreaInput id="nutrition-nutritionNotes" label="Nutrition notes" rows={2} bind:value={d.nutrition.nutritionNotes} />
	</Field>
</Fieldset>
