<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO_OPTS } from '#lib/config/options.js';
	import { assessmentStore } from '#lib/stores/assessment.svelte.js';

	const d = assessmentStore.data;
</script>

<Fieldset legend="5. Allergies and Intolerances">
	<p class="hint">Drug, food, and contact allergies, with the reaction and its severity.</p>

	<Field label="Drug allergy" inputId="allergy-hasDrugAllergy">
		<Select id="allergy-hasDrugAllergy" label="Drug allergy" bind:value={d.allergy.hasDrugAllergy}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Drug allergy detail" inputId="allergy-drugAllergyDetail">
		<TextInput id="allergy-drugAllergyDetail" label="Drug allergy detail" placeholder="Drug and reaction" bind:value={d.allergy.drugAllergyDetail} />
	</Field>
	<Field label="Food allergy" inputId="allergy-hasFoodAllergy">
		<Select id="allergy-hasFoodAllergy" label="Food allergy" bind:value={d.allergy.hasFoodAllergy}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Food allergy detail" inputId="allergy-foodAllergyDetail">
		<TextInput id="allergy-foodAllergyDetail" label="Food allergy detail" bind:value={d.allergy.foodAllergyDetail} />
	</Field>
	<Field label="Latex" inputId="allergy-hasLatexAllergy">
		<Select id="allergy-hasLatexAllergy" label="Latex" bind:value={d.allergy.hasLatexAllergy}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Adhesives or dressings" inputId="allergy-hasAdhesiveAllergy">
		<Select id="allergy-hasAdhesiveAllergy" label="Adhesives or dressings" bind:value={d.allergy.hasAdhesiveAllergy}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Radiological contrast" inputId="allergy-hasContrastAllergy">
		<Select id="allergy-hasContrastAllergy" label="Radiological contrast" bind:value={d.allergy.hasContrastAllergy}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Worst reaction severity" inputId="allergy-allergySeverity">
		<Select id="allergy-allergySeverity" label="Worst reaction severity" bind:value={d.allergy.allergySeverity}>
			<option value="">— Select —</option>
			{#each OPTIONS.allergySeverity as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Carries an adrenaline auto-injector" inputId="allergy-adrenalineAutoInjector">
		<Select id="allergy-adrenalineAutoInjector" label="Carries an adrenaline auto-injector" bind:value={d.allergy.adrenalineAutoInjector}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Allergy notes" inputId="allergy-allergyNotes">
		<TextAreaInput id="allergy-allergyNotes" label="Allergy notes" rows={2} bind:value={d.allergy.allergyNotes} />
	</Field>
</Fieldset>
