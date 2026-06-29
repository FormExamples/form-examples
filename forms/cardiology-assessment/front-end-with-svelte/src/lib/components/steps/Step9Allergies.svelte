<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import AllergyEntry from '$lib/components/ui/AllergyEntry.svelte';

	const a = assessment.data.allergies;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Allergies">
	<p class="hint">Drug allergies and contrast allergy.</p>

	<Field label="Do you have any drug allergies?">
		<RadioGroup label="Do you have any drug allergies?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="drugAllergies" value={opt.value} bind:group={a.drugAllergies} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if a.drugAllergies === 'yes'}
		<Field label="Drug allergy details">
			<AllergyEntry bind:allergies={a.allergies} />
		</Field>
	{/if}

	<Field label="Do you have a contrast dye allergy?">
		<RadioGroup label="Do you have a contrast dye allergy?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="contrastAllergy" value={opt.value} bind:group={a.contrastAllergy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if a.contrastAllergy === 'yes'}
		<Field label="Contrast allergy details" inputId="contrastAllergyDetails">
			<TextInput id="contrastAllergyDetails" label="Contrast allergy details" placeholder="e.g. Iodine contrast - rash and wheeze" bind:value={a.contrastAllergyDetails} />
		</Field>
	{/if}
</Fieldset>
