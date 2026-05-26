<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { formatAge } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	const m = assessment.data.developmentalMilestones;
	const dob = assessment.data.demographics.dateOfBirth;
	const ageDisplay = $derived(formatAge(dob));

	const domainOptions = [
		{ value: 'pass', label: 'Pass' },
		{ value: 'concern', label: 'Concern' },
		{ value: 'fail', label: 'Fail' }
	];

	type DomainKey = 'grossMotor' | 'fineMotor' | 'language' | 'socialEmotional' | 'cognitive';
	type DomainNotesKey = 'grossMotorNotes' | 'fineMotorNotes' | 'languageNotes' | 'socialEmotionalNotes' | 'cognitiveNotes';

	const domains: { key: DomainKey; notesKey: DomainNotesKey; label: string }[] = [
		{ key: 'grossMotor', notesKey: 'grossMotorNotes', label: 'Gross Motor (e.g., sitting, crawling, walking, running)' },
		{ key: 'fineMotor', notesKey: 'fineMotorNotes', label: 'Fine Motor (e.g., grasping, drawing, writing)' },
		{ key: 'language', notesKey: 'languageNotes', label: 'Language (e.g., babbling, first words, sentences)' },
		{ key: 'socialEmotional', notesKey: 'socialEmotionalNotes', label: 'Social-Emotional (e.g., eye contact, social smile, play)' },
		{ key: 'cognitive', notesKey: 'cognitiveNotes', label: 'Cognitive (e.g., problem-solving, memory, attention)' }
	];
</script>

<Fieldset legend="Developmental Milestones">
	<p class="hint">Age-appropriate developmental screening across five domains.</p>

	{#if ageDisplay}
		<Alert type="info">
			Child's age: <strong>{ageDisplay}</strong> - assess milestones appropriate for this age.
		</Alert>
	{/if}

	{#each domains as d (d.key)}
		<Field label={d.label} required>
			<RadioGroup label={d.label}>
				{#each domainOptions as opt (opt.value)}
					<label>
						<input type="radio" class="radio-input" name={d.key} value={opt.value} bind:group={m[d.key]} required />
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
		{#if m[d.key] === 'concern' || m[d.key] === 'fail'}
			<Field label="Notes" inputId={`${d.key}Notes`}>
				<TextAreaInput id={`${d.key}Notes`} label={`${d.label} notes`} rows={2} bind:value={m[d.notesKey]} />
			</Field>
		{/if}
	{/each}
</Fieldset>
