<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import PriorTestList from '#lib/components/ui/PriorTestList.svelte';

	const d = assessment.data.priorGeneticTesting;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Prior Genetic Testing">
	<p class="hint">Tests already undertaken on the proband or a close relative.</p>

	<Field label="Has the proband had any prior genetic testing?">
		<RadioGroup label="Prior testing?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="priorTesting" value={opt.value} bind:group={d.priorTesting} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.priorTesting === 'yes'}
		<h3 class="mt-2 text-sm font-semibold text-base-content">Prior tests</h3>
		<PriorTestList bind:tests={d.priorTests} />
	{/if}

	<Field label="Variants of uncertain significance (VUS) previously reported?">
		<RadioGroup label="VUS reported?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="vus" value={opt.value} bind:group={d.variantsOfUncertainSignificance} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.variantsOfUncertainSignificance === 'yes'}
		<Field label="VUS details" inputId="vusDetails">
			<TextAreaInput id="vusDetails" label="VUS details" rows={2} bind:value={d.variantsOfUncertainSignificanceDetails} />
		</Field>
	{/if}

	<Field label="Is there a known familial pathogenic variant in a close relative?">
		<RadioGroup label="Familial variant known?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="familialVariant" value={opt.value} bind:group={d.familialVariantKnown} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.familialVariantKnown === 'yes'}
		<Field label="Familial variant details (gene, variant, relative)" inputId="familialVariantDetails">
			<TextAreaInput
				id="familialVariantDetails"
				label="Familial variant details"
				rows={2}
				placeholder="e.g. BRCA1 c.5266dupC in maternal aunt"
				bind:value={d.familialVariantDetails}
			/>
		</Field>
	{/if}

	<Field label="Has the proband had prior formal genetic counselling?">
		<RadioGroup label="Prior genetic counselling?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="priorCounselling" value={opt.value} bind:group={d.priorGeneticCounselling} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Notes from prior counselling" inputId="priorCounsellingNotes">
		<TextAreaInput id="priorCounsellingNotes" label="Notes from prior counselling" rows={2} bind:value={d.priorCounsellingNotes} />
	</Field>
</Fieldset>
