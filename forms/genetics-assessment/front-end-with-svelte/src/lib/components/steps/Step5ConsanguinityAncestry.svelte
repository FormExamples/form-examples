<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const d = assessment.data.consanguinityAncestry;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Consanguinity & Ancestry">
	<p class="hint">Reproductive partner relatedness and population background.</p>

	<Field label="Is there consanguinity in the family (parents related by blood, e.g. first cousins)?">
		<RadioGroup label="Consanguinity?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="consanguinity" value={opt.value} bind:group={d.consanguinity} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.consanguinity === 'yes'}
		<Field label="Consanguinity details" inputId="consanguinityDetails">
			<TextInput id="consanguinityDetails" label="Consanguinity details" placeholder="e.g. first cousins, double first cousins" bind:value={d.consanguinityDetails} />
		</Field>
	{/if}

	<div class="field-grid">
		<Field label="Maternal ancestry / origin" inputId="maternalAncestry">
			<TextInput id="maternalAncestry" label="Maternal ancestry" bind:value={d.maternalAncestry} />
		</Field>
		<Field label="Paternal ancestry / origin" inputId="paternalAncestry">
			<TextInput id="paternalAncestry" label="Paternal ancestry" bind:value={d.paternalAncestry} />
		</Field>
	</div>

	<Field
		label="Ashkenazi Jewish ancestry?"
		description="Three BRCA1/2 founder variants are common in this population."
	>
		<RadioGroup label="Ashkenazi Jewish ancestry?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="ashkenaziJewish" value={opt.value} bind:group={d.ashkenaziJewish} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Sephardic Jewish ancestry?">
		<RadioGroup label="Sephardic Jewish ancestry?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="sephardicJewish" value={opt.value} bind:group={d.sephardicJewish} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Other founding-population ancestry (Quebecois, Finnish, Icelandic, Afrikaner, etc.)?">
		<RadioGroup label="Founding-population ancestry?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="foundingPopulation" value={opt.value} bind:group={d.foundingPopulation} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.foundingPopulation === 'yes'}
		<Field label="Founding-population details" inputId="foundingPopulationDetails">
			<TextInput id="foundingPopulationDetails" label="Founding-population details" bind:value={d.foundingPopulationDetails} />
		</Field>
	{/if}
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
