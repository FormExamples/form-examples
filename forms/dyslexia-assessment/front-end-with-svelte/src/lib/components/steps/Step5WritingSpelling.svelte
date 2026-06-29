<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioField from './RadioField.svelte';
	import ScoreField from './ScoreField.svelte';

	const d = assessment.data.writingSpelling;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Section 5 of 10 · Writing & Spelling Assessment">
	<p class="hint">Standardised written-language scores and observed difficulties.</p>

	<ScoreField label="Spelling accuracy standardised score" id="spellingAccuracyScore" bind:value={d.spellingAccuracyScore} />
	<ScoreField label="Written expression standardised score" id="writtenExpressionScore" bind:value={d.writtenExpressionScore} />

	<RadioField label="Difficulty with spelling?" name="difficultySpelling" options={yesNo} bind:value={d.difficultySpelling} />
	<RadioField label="Difficulty with handwriting?" name="difficultyHandwriting" options={yesNo} bind:value={d.difficultyHandwriting} />
	<RadioField label="Difficulty organising ideas in writing?" name="difficultyOrganisingIdeas" options={yesNo} bind:value={d.difficultyOrganisingIdeas} />
	<RadioField label="Omits letters or words?" name="omitsLettersOrWords" options={yesNo} bind:value={d.omitsLettersOrWords} />
	<RadioField label="Reverses letters or numbers?" name="reversesLettersOrNumbers" options={yesNo} bind:value={d.reversesLettersOrNumbers} />

	<Field label="Writing notes" inputId="writingNotes">
		<TextAreaInput id="writingNotes" label="Writing notes" rows={3} bind:value={d.writingNotes} />
	</Field>
</Fieldset>
