<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import AllergyEntry from '$lib/components/ui/AllergyEntry.svelte';

	const a = assessment.data.allergies;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	function addEnvironmentalAllergy() {
		a.environmentalAllergies = [...a.environmentalAllergies, ''];
	}

	function removeEnvironmentalAllergy(index: number) {
		a.environmentalAllergies = a.environmentalAllergies.filter((_, i) => i !== index);
	}
</script>

<Fieldset legend="Allergies">
	<p class="hint">Document drug allergies and environmental sensitivities.</p>

	<Field label="Drug Allergies">
		<AllergyEntry bind:allergies={a.drugAllergies} />
	</Field>

	<Field label="Environmental Allergies">
		<div class="env-list">
			{#each a.environmentalAllergies as _, i (i)}
				<div class="env-row">
					<input
						type="text"
						class="text-input"
						placeholder="e.g., dust mites, pollen, mould, pet dander"
						aria-label="Environmental allergen"
						bind:value={a.environmentalAllergies[i]}
					/>
					<button
						type="button"
						class="button"
						data-variant="danger"
						onclick={() => removeEnvironmentalAllergy(i)}
						aria-label="Remove environmental allergy"
					>×</button>
				</div>
			{/each}
			<button type="button" class="button" onclick={addEnvironmentalAllergy}>+ Add Environmental Allergy</button>
		</div>
	</Field>

	<Field label="Has allergy testing been done?">
		<RadioGroup label="Allergy testing done">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="allergyTestingDone" value={opt.value} bind:group={a.allergyTestingDone} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if a.allergyTestingDone === 'yes'}
		<Field label="Allergy Test Results" inputId="allergyTestResults">
			<TextAreaInput id="allergyTestResults" label="Allergy test results" rows={3} bind:value={a.allergyTestResults} />
		</Field>
	{/if}
</Fieldset>

<style>
	.env-list { display: flex; flex-direction: column; gap: 0.5rem; }
	.env-row { display: flex; align-items: center; gap: 0.5rem; }
	.env-row .text-input { flex: 1; }
</style>
