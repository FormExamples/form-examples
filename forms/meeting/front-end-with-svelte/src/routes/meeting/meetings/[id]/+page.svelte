<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { meeting } from '$lib/stores/meeting.svelte';
	import { validateMeeting } from '$lib/engine/meeting-validator';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleMeetings } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Organizer from '$lib/components/steps/Step1Organizer.svelte';
	import Step2TitlePurpose from '$lib/components/steps/Step2TitlePurpose.svelte';
	import Step3Invitation from '$lib/components/steps/Step3Invitation.svelte';
	import Step4Agenda from '$lib/components/steps/Step4Agenda.svelte';
	import Step5Participants from '$lib/components/steps/Step5Participants.svelte';
	import Step6Resources from '$lib/components/steps/Step6Resources.svelte';
	import Step7Recurrence from '$lib/components/steps/Step7Recurrence.svelte';
	import Step8Summary from '$lib/components/steps/Step8Summary.svelte';
	import Step9Results from '$lib/components/steps/Step9Results.svelte';
	import Step10SignOff from '$lib/components/steps/Step10SignOff.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample meeting (existing id) or a
	// blank draft (new).
	$effect(() => {
		const seed = sampleMeetings.find((s) => s.id === id)?.data;
		if (meeting.id !== id) {
			meeting.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = meeting.data;
		const found: { id: string; message: string }[] = [];
		if (d.meta.title.trim() === '') {
			found.push({ id: 'title', message: 'Meeting title is required.' });
		}
		if ((d.summary.summary ?? '').length > 250) {
			found.push({ id: 'summary', message: 'Summary must be 250 characters or fewer.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		meeting.result = validateMeeting(meeting.data);
		goto(`/meeting/meetings/${id}/report`);
	}

	function startOver() {
		const seed = sampleMeetings.find((s) => s.id === id)?.data;
		meeting.reset();
		meeting.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-16 px-4 py-6">
	<h1 class="text-2xl font-bold text-base-content">
		{isNew ? 'New meeting record' : `Meeting ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the ten sections; the validation report and overall health are computed on submit.
	</p>
	<Progress label="Meeting sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Meeting sections" current={TOTAL_STEPS}>
		{#each steps as step (step.number)}
			<StepListItem status="finished" label={step.title}>{step.shortTitle}</StepListItem>
		{/each}
	</StepList>

	{#if errors.length > 0}
		<ErrorSummary title="Please fix the following before submitting" class="mb-6">
			<ul>
				{#each errors as e (e.id)}
					<li><a href={`#${e.id}`}>{e.message}</a></li>
				{/each}
			</ul>
		</ErrorSummary>
	{/if}

	<Form label="Meeting record" onsubmit={submit}>
		<Step1Organizer />
		<Step2TitlePurpose />
		<Step3Invitation />
		<Step4Agenda />
		<Step5Participants />
		<Step6Resources />
		<Step7Recurrence />
		<Step8Summary />
		<Step9Results />
		<Step10SignOff />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Validate &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
