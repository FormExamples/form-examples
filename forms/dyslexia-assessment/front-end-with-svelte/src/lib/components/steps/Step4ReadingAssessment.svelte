<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioField from './RadioField.svelte';
	import ScoreField from './ScoreField.svelte';

	const d = assessment.data.readingAssessment;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Section 4 of 10 · Reading Assessment">
	<p class="hint">Standardised reading scores and observed difficulties.</p>

	<ScoreField label="Reading fluency standardised score" id="readingFluencyScore" bind:value={d.readingFluencyScore} />
	<ScoreField label="Reading comprehension standardised score" id="readingComprehensionScore" bind:value={d.readingComprehensionScore} />

	<RadioField label="Difficulty decoding words?" name="difficultyDecoding" options={yesNo} bind:value={d.difficultyDecoding} />
	<RadioField label="Difficulty with reading comprehension?" name="difficultyComprehension" options={yesNo} bind:value={d.difficultyComprehension} />
	<RadioField label="Avoids reading?" name="avoidsReading" options={yesNo} bind:value={d.avoidsReading} />
	<RadioField label="Slow reading speed?" name="slowReadingSpeed" options={yesNo} bind:value={d.slowReadingSpeed} />
	<RadioField label="Loses place when reading?" name="losesPlaceWhenReading" options={yesNo} bind:value={d.losesPlaceWhenReading} />

	<Field label="Reading notes" inputId="readingNotes">
		<TextAreaInput id="readingNotes" label="Reading notes" rows={3} bind:value={d.readingNotes} />
	</Field>
</Fieldset>
