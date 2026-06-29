<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioField from './RadioField.svelte';
	import ScoreField from './ScoreField.svelte';

	const d = assessment.data.workingMemoryProcessingSpeed;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Section 7 of 10 · Working Memory & Processing Speed">
	<p class="hint">Cognitive load and pace of work.</p>

	<ScoreField label="Working memory standardised score" id="workingMemoryScore" bind:value={d.workingMemoryScore} />
	<ScoreField label="Processing speed standardised score" id="processingSpeedScore" bind:value={d.processingSpeedScore} />

	<RadioField label="Difficulty following multi-step instructions?" name="difficultyFollowingInstructions" options={yesNo} bind:value={d.difficultyFollowingInstructions} />
	<RadioField label="Difficulty remembering sequences?" name="difficultyRememberingSequences" options={yesNo} bind:value={d.difficultyRememberingSequences} />
	<RadioField label="Slow to complete tasks?" name="slowToCompleteTasks" options={yesNo} bind:value={d.slowToCompleteTasks} />
	<RadioField label="Difficulty taking notes?" name="difficultyTakingNotes" options={yesNo} bind:value={d.difficultyTakingNotes} />

	<Field label="Working memory / processing speed notes" inputId="memoryNotes">
		<TextAreaInput id="memoryNotes" label="Working memory / processing speed notes" rows={3} bind:value={d.memoryNotes} />
	</Field>
</Fieldset>
