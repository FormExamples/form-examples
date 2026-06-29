<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const g = assessment.data.geneticTestingHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset title="Genetic Testing History" description="Previous genetic tests and counseling history">
	<RadioGroup label="Have you had any previous genetic tests?" name="previousGeneticTests" options={yesNo} bind:value={g.previousGeneticTests} />
	{#if g.previousGeneticTests === 'yes'}
		<TextAreaInput
			label="What tests were performed?"
			name="previousGeneticTestsDetails"
			bind:value={g.previousGeneticTestsDetails}
			placeholder="e.g., BRCA panel, carrier screening, whole exome sequencing..."
		/>

		<TextAreaInput
			label="Test results"
			name="testResults"
			bind:value={g.testResults}
			placeholder="Describe the results (positive, negative, inconclusive)..."
		/>
	{/if}

	<RadioGroup label="Have you previously received genetic counseling?" name="geneticCounseling" options={yesNo} bind:value={g.geneticCounseling} />

	<RadioGroup label="Have any variants of uncertain significance (VUS) been identified?" name="variantsOfUncertainSignificance" options={yesNo} bind:value={g.variantsOfUncertainSignificance} />
	{#if g.variantsOfUncertainSignificance === 'yes'}
		<TextAreaInput
			label="Please provide details about the VUS"
			name="variantsOfUncertainSignificanceDetails"
			bind:value={g.variantsOfUncertainSignificanceDetails}
			placeholder="Gene name, variant, classification..."
		/>
	{/if}
</Fieldset>
