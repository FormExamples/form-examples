<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const e = assessment.data.environmentalAllergies;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	type EnvKey =
		| 'pollenAllergy'
		| 'dustMiteAllergy'
		| 'mouldAllergy'
		| 'animalDanderAllergy'
		| 'latexAllergy'
		| 'insectStingAllergy';

	const envRadios: { key: EnvKey; label: string; name: string }[] = [
		{ key: 'pollenAllergy', label: 'Pollen allergy?', name: 'pollen' },
		{ key: 'dustMiteAllergy', label: 'Dust mite allergy?', name: 'dustMite' },
		{ key: 'mouldAllergy', label: 'Mould allergy?', name: 'mould' },
		{ key: 'animalDanderAllergy', label: 'Animal dander allergy?', name: 'animalDander' },
		{ key: 'latexAllergy', label: 'Latex allergy?', name: 'latex' },
		{ key: 'insectStingAllergy', label: 'Insect sting allergy?', name: 'insectSting' }
	];
</script>

<Fieldset legend="Environmental Allergies">
	<p class="hint">Pollen, dust mites, mould, animal dander, latex, and insect stings.</p>

	{#each envRadios as r (r.key)}
		<Field label={r.label}>
			<RadioGroup label={r.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={r.name} value={opt.value} bind:group={e[r.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	{#if e.insectStingAllergy === 'yes'}
		<Field label="Insect sting reaction severity" required inputId="insectStingSeverity">
			<Select id="insectStingSeverity" label="Insect sting reaction severity" required bind:value={e.insectStingSeverity}>
				<option value="">— Select —</option>
				<option value="mild">Mild (local reaction)</option>
				<option value="moderate">Moderate (large local or mild systemic)</option>
				<option value="severe">Severe (systemic reaction)</option>
				<option value="anaphylaxis">Anaphylaxis</option>
			</Select>
		</Field>
	{/if}

	<Field label="Seasonal pattern" inputId="seasonalPattern">
		<Select id="seasonalPattern" label="Seasonal pattern" bind:value={e.seasonalPattern}>
			<option value="">— Select —</option>
			<option value="perennial">Perennial (year-round)</option>
			<option value="spring">Spring</option>
			<option value="summer">Summer</option>
			<option value="autumn">Autumn</option>
			<option value="winter">Winter</option>
			<option value="multiple">Multiple seasons</option>
		</Select>
	</Field>

	<Field label="Other environmental allergens" inputId="otherEnvironmental">
		<TextAreaInput id="otherEnvironmental" label="Other environmental allergens" rows={3} bind:value={e.otherEnvironmentalAllergens} />
	</Field>
</Fieldset>
