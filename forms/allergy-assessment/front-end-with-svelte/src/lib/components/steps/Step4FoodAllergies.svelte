<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import AllergyEntry from '#lib/components/ui/AllergyEntry.svelte';

	const f = $state(assessment.data.foodAllergies);
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Food Allergies">
	<p class="hint">Specific food allergies, IgE type, and dietary restrictions.</p>

	<Field label="Do you have any food allergies?">
		<RadioGroup label="Do you have any food allergies?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasFoodAllergies" value={opt.value} bind:group={f.hasFoodAllergies} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if f.hasFoodAllergies === 'yes'}
		<Field label="Food allergy details">
			<AllergyEntry bind:allergies={f.foodAllergies} />
		</Field>

		<Field label="IgE classification" inputId="igeType">
			<Select id="igeType" label="IgE classification" bind:value={f.igeType}>
				<option value="">— Select —</option>
				<option value="IgE-mediated">IgE-mediated</option>
				<option value="non-IgE-mediated">Non-IgE-mediated</option>
				<option value="mixed">Mixed</option>
				<option value="unknown">Unknown</option>
			</Select>
		</Field>

		<Field label="Oral allergy syndrome?">
			<RadioGroup label="Oral allergy syndrome?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="oralAllergy" value={opt.value} bind:group={f.oralAllergySyndrome} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Dietary restrictions" inputId="dietaryRestrictions">
			<TextAreaInput id="dietaryRestrictions" label="Dietary restrictions" rows={3} bind:value={f.dietaryRestrictions} />
		</Field>
	{/if}
</Fieldset>
