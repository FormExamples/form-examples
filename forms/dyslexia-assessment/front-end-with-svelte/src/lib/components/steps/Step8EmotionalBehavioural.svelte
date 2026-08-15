<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioField from './RadioField.svelte';

	const d = assessment.data.emotionalBehavioural;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Section 8 of 10 · Emotional & Behavioural Impact">
	<p class="hint">Secondary effects on wellbeing and behaviour.</p>

	<RadioField label="Low self-esteem?" name="lowSelfEsteem" options={yesNo} bind:value={d.lowSelfEsteem} />
	<RadioField label="Anxiety about school or learning?" name="anxietyAboutSchool" options={yesNo} bind:value={d.anxietyAboutSchool} />
	<RadioField label="Avoidance behaviour?" name="avoidanceBehaviour" options={yesNo} bind:value={d.avoidanceBehaviour} />
	<RadioField label="Frustration with learning?" name="frustrationWithLearning" options={yesNo} bind:value={d.frustrationWithLearning} />
	<RadioField label="Peer relationship difficulties?" name="peerRelationshipDifficulties" options={yesNo} bind:value={d.peerRelationshipDifficulties} />
	<RadioField label="Sleep disturbance?" name="sleepDisturbance" options={yesNo} bind:value={d.sleepDisturbance} />

	<RadioField label="Mental health concerns?" name="mentalHealthConcerns" options={yesNo} bind:value={d.mentalHealthConcerns} />
	{#if d.mentalHealthConcerns === 'yes'}
		<Field label="Mental health details" inputId="mentalHealthDetails">
			<TextAreaInput id="mentalHealthDetails" label="Mental health details" rows={3} bind:value={d.mentalHealthDetails} />
		</Field>
	{/if}

	<Field label="Behavioural notes" inputId="behaviouralNotes">
		<TextAreaInput id="behaviouralNotes" label="Behavioural notes" rows={3} bind:value={d.behaviouralNotes} />
	</Field>
</Fieldset>
