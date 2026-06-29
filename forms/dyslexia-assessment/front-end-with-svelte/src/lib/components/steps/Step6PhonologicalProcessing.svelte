<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioField from './RadioField.svelte';
	import ScoreField from './ScoreField.svelte';

	const d = assessment.data.phonologicalProcessing;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Section 6 of 10 · Phonological Processing">
	<p class="hint">Awareness, memory, and rapid naming.</p>

	<ScoreField label="Phonological awareness standardised score" id="phonologicalAwarenessScore" bind:value={d.phonologicalAwarenessScore} />
	<ScoreField label="Phonological memory standardised score" id="phonologicalMemoryScore" bind:value={d.phonologicalMemoryScore} />
	<ScoreField label="Rapid automatised naming standardised score" id="rapidNamingScore" bind:value={d.rapidNamingScore} />

	<RadioField label="Difficulty with rhyming?" name="difficultyRhyming" options={yesNo} bind:value={d.difficultyRhyming} />
	<RadioField label="Difficulty segmenting sounds?" name="difficultySegmentingSounds" options={yesNo} bind:value={d.difficultySegmentingSounds} />
	<RadioField label="Difficulty blending sounds?" name="difficultyBlendingSounds" options={yesNo} bind:value={d.difficultyBlendingSounds} />
	<RadioField label="Difficulty learning letter–sound correspondences?" name="difficultyLearningLetterSounds" options={yesNo} bind:value={d.difficultyLearningLetterSounds} />

	<Field label="Phonological processing notes" inputId="phonologicalNotes">
		<TextAreaInput id="phonologicalNotes" label="Phonological processing notes" rows={3} bind:value={d.phonologicalNotes} />
	</Field>
</Fieldset>
