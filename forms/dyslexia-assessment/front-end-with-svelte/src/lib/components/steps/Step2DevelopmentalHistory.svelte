<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioField from './RadioField.svelte';

	const d = assessment.data.developmentalHistory;

	const yesNoUnsure = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'unsure', label: 'Unsure' }
	];
</script>

<Fieldset legend="Section 2 of 10 · Developmental History">
	<p class="hint">Pregnancy, birth, milestones, and family history.</p>

	<RadioField label="Were there pregnancy complications?" name="pregnancyComplications" options={yesNoUnsure} bind:value={d.pregnancyComplications} />
	{#if d.pregnancyComplications === 'yes'}
		<Field label="Pregnancy details" inputId="pregnancyDetails">
			<TextAreaInput id="pregnancyDetails" label="Pregnancy details" rows={2} bind:value={d.pregnancyDetails} />
		</Field>
	{/if}

	<RadioField label="Were there birth complications?" name="birthComplications" options={yesNoUnsure} bind:value={d.birthComplications} />
	{#if d.birthComplications === 'yes'}
		<Field label="Birth details" inputId="birthDetails">
			<TextAreaInput id="birthDetails" label="Birth details" rows={2} bind:value={d.birthDetails} />
		</Field>
	{/if}

	<Field label="Early developmental milestones" inputId="earlyMilestones">
		<TextAreaInput id="earlyMilestones" label="Early developmental milestones" rows={2} bind:value={d.earlyMilestones} />
	</Field>

	<RadioField label="Was there a speech delay?" name="speechDelay" options={yesNoUnsure} bind:value={d.speechDelay} />
	<RadioField label="Was there a language delay?" name="languageDelay" options={yesNoUnsure} bind:value={d.languageDelay} />
	<RadioField label="Are there any hearing problems (current or historical)?" name="hearingProblems" options={yesNoUnsure} bind:value={d.hearingProblems} />
	<RadioField label="Are there any vision problems (current or historical)?" name="visionProblems" options={yesNoUnsure} bind:value={d.visionProblems} />

	<RadioField label="Family history of dyslexia or specific learning difficulty?" name="familyHistoryDyslexia" options={yesNoUnsure} bind:value={d.familyHistoryDyslexia} />
	{#if d.familyHistoryDyslexia === 'yes'}
		<Field label="Family history details" inputId="familyHistoryDetails">
			<TextAreaInput id="familyHistoryDetails" label="Family history details" rows={2} bind:value={d.familyHistoryDetails} />
		</Field>
	{/if}

	<Field label="Other developmental notes" inputId="otherDevelopmentalNotes">
		<TextAreaInput id="otherDevelopmentalNotes" label="Other developmental notes" rows={2} bind:value={d.otherDevelopmentalNotes} />
	</Field>
</Fieldset>
