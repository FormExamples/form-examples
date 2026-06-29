<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.teamDynamicsHandoff;
	const tri = [
		{ value: 'yes', label: 'Demonstrated' },
		{ value: 'no', label: 'Not yet' },
		{ value: 'na', label: 'Not assessed' }
	];
	const items = [
		{ name: 'clearCommunication', label: 'Uses clear, calm communication with the team.' },
		{ name: 'closedLoopOrders', label: 'Uses closed-loop communication for orders and tasks.' },
		{ name: 'appropriateHandoff', label: 'Provides a structured handoff to incoming providers (SBAR).' },
		{ name: 'debriefParticipated', label: 'Participates constructively in the post-event debrief.' }
	] as const;
</script>

<Fieldset legend="Team Dynamics, Handoff & Feedback">
	<p class="hint">Communication, structured handoff, and post-event debrief.</p>

	{#each items as item (item.name)}
		<Field label={item.label}>
			<RadioGroup label={item.label}>
				{#each tri as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={item.name} value={opt.value} bind:group={d[item.name]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Examiner notes" inputId="examinerNotes">
		<TextAreaInput id="examinerNotes" label="Examiner notes" rows={3} bind:value={d.examinerNotes} />
	</Field>
	<Field label="Trainee self-feedback" inputId="traineeFeedback">
		<TextAreaInput id="traineeFeedback" label="Trainee self-feedback" rows={3} bind:value={d.traineeFeedback} />
	</Field>
</Fieldset>
