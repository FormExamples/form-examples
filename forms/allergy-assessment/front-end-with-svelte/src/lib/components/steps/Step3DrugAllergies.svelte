<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import AllergyEntry from '$lib/components/ui/AllergyEntry.svelte';

	const d = assessment.data.drugAllergies;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Drug Allergies">
	<p class="hint">Specific drug allergies, reaction types, severity, and cross-reactivity.</p>

	<Field label="Do you have any drug allergies?">
		<RadioGroup label="Do you have any drug allergies?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasDrugAllergies" value={opt.value} bind:group={d.hasDrugAllergies} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.hasDrugAllergies === 'yes'}
		<Field label="Drug allergy details">
			<AllergyEntry bind:allergies={d.drugAllergies} />
		</Field>

		<Field label="Cross-reactivity concerns" inputId="crossReactivity">
			<TextAreaInput id="crossReactivity" label="Cross-reactivity concerns" rows={3} bind:value={d.crossReactivityConcerns} />
		</Field>
	{/if}
</Fieldset>
