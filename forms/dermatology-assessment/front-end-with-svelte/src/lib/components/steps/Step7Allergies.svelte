<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import AllergyEntry from '#lib/components/ui/AllergyEntry.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const a = assessment.data.allergies;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Allergies">
	<p class="hint">Drug allergies, contact allergies, and latex sensitivity.</p>

	<Field label="Drug Allergies">
		<AllergyEntry bind:allergies={a.drugAllergies} />
		{#if a.drugAllergies.length === 0}
			<p class="hint">No drug allergies added. Click the button above to add one, or proceed if you have none.</p>
		{/if}
	</Field>

	<Field label="Contact allergies (e.g., nickel, fragrances, adhesives)" inputId="contactAllergies">
		<TextAreaInput id="contactAllergies" label="Contact allergies" rows={3} placeholder="List any known contact allergies..." bind:value={a.contactAllergies} />
	</Field>

	<Field label="Do you have a latex allergy?">
		<RadioGroup label="Latex allergy">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="latexAllergy" value={opt.value} bind:group={a.latexAllergy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
