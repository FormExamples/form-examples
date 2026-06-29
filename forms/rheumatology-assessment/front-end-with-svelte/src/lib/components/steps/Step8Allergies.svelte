<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import AllergyEntry from '$lib/components/ui/AllergyEntry.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.allergies;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Allergies">
	<p class="hint">Drug allergies and latex sensitivity.</p>

	<h3 class="section-h">Drug Allergies</h3>
	<AllergyEntry bind:allergies={d.drugAllergies} />
	{#if d.drugAllergies.length === 0}
		<p class="hint">No drug allergies added.</p>
	{/if}

	<Field label="Latex Allergy">
		<RadioGroup label="Latex allergy">
			{#each yesNoOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="latexAllergy" value={opt.value} bind:group={d.latexAllergy} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>

<style>.section-h { font-weight: 600; margin: 1rem 0 0.5rem; color: var(--color-text); }</style>
