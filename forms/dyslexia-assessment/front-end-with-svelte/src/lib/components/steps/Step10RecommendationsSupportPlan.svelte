<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import RadioField from './RadioField.svelte';

	const d = assessment.data.recommendationsSupportPlan;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const recommendedSupports = [
		{ value: 'phonics', label: 'Structured phonics programme' },
		{ value: 'multisensory-literacy', label: 'Multisensory literacy intervention' },
		{ value: 'reading-fluency', label: 'Reading fluency intervention' },
		{ value: 'spelling-programme', label: 'Targeted spelling programme' },
		{ value: 'handwriting', label: 'Handwriting / OT support' },
		{ value: 'maths-support', label: 'Maths support' },
		{ value: 'study-skills', label: 'Study skills coaching' },
		{ value: 'small-group', label: 'Small-group teaching' },
		{ value: 'one-to-one', label: 'One-to-one teaching' }
	];
</script>

<Fieldset legend="Section 10 of 10 · Recommendations & Support Plan">
	<p class="hint">Plan for next steps.</p>

	<Field label="Recommended supports">
		<CheckboxGroup label="Recommended supports">
			{#each recommendedSupports as opt (opt.value)}
				<label>
					<input type="checkbox" class="checkbox-input" value={opt.value} bind:group={d.recommendedSupports} />
					{opt.label}
				</label>
			{/each}
		</CheckboxGroup>
	</Field>

	<RadioField label="Recommend structured literacy programme?" name="structuredLiteracyRecommended" options={yesNo} bind:value={d.structuredLiteracyRecommended} />
	<RadioField label="Recommend assistive technology?" name="assistiveTechRecommended" options={yesNo} bind:value={d.assistiveTechRecommended} />
	<RadioField label="Recommend extra time in assessments?" name="extraTimeRecommended" options={yesNo} bind:value={d.extraTimeRecommended} />
	<RadioField label="Recommend full specialist diagnostic assessment?" name="specialistAssessmentRecommended" options={yesNo} bind:value={d.specialistAssessmentRecommended} />
	<RadioField label="Recommend parent training / coaching?" name="parentTrainingRecommended" options={yesNo} bind:value={d.parentTrainingRecommended} />

	<Field label="Key goals" inputId="keyGoals">
		<TextAreaInput id="keyGoals" label="Key goals" rows={3} bind:value={d.keyGoals} />
	</Field>
	<Field label="Review timeframe" inputId="reviewTimeframe">
		<TextInput id="reviewTimeframe" label="Review timeframe" bind:value={d.reviewTimeframe} />
	</Field>
	<Field label="Additional recommendations" inputId="additionalRecommendations">
		<TextAreaInput id="additionalRecommendations" label="Additional recommendations" rows={3} bind:value={d.additionalRecommendations} />
	</Field>
</Fieldset>
