<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import YesNoRadio from '$lib/components/ui/YesNoRadio.svelte';

	const d = assessment.data.exitInterview;
</script>

<Fieldset legend="Exit Interview">
	<p class="hint">Record whether an exit interview was offered, completed, and documented.</p>

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Exit interview offered">
			<YesNoRadio label="Exit interview offered" name="interviewOffered" bind:value={d.interviewOffered} />
		</Field>
		<Field label="Exit interview completed">
			<YesNoRadio label="Exit interview completed" name="interviewCompleted" bind:value={d.interviewCompleted} />
		</Field>
		<Field label="Interview date" inputId="interviewDate">
			<DateInput id="interviewDate" label="Interview date" bind:value={d.interviewDate} />
		</Field>
		<Field label="Interviewer name" inputId="interviewerName">
			<TextInput id="interviewerName" label="Interviewer name" bind:value={d.interviewerName} />
		</Field>
		<Field label="Feedback provided">
			<YesNoRadio label="Feedback provided" name="feedbackProvided" bind:value={d.feedbackProvided} />
		</Field>
		<Field label="Feedback documented">
			<YesNoRadio label="Feedback documented" name="feedbackDocumented" bind:value={d.feedbackDocumented} />
		</Field>
		<Field label="Concerns raised">
			<YesNoRadio label="Concerns raised" name="concernsRaised" bind:value={d.concernsRaised} />
		</Field>
	</div>

	{#if d.concernsRaised === 'yes'}
		<Field label="Concerns detail" inputId="concernsDetails">
			<TextAreaInput id="concernsDetails" label="Concerns detail" rows={3} bind:value={d.concernsDetails} />
		</Field>
	{/if}

	<Field label="Notes" inputId="exitInterviewNotes">
		<TextAreaInput id="exitInterviewNotes" label="Notes" rows={3} bind:value={d.exitInterviewNotes} />
	</Field>
</Fieldset>
