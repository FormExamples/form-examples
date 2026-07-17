<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { store } from '$lib/stores/card.svelte';
	import { calculateWaitingTimeStatus } from '$lib/engine/composite-grader';
	import { STEPS, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleCards } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Practitioner from '$lib/components/steps/Step1Practitioner.svelte';
	import Step2Patient from '$lib/components/steps/Step2Patient.svelte';
	import Step3Referral from '$lib/components/steps/Step3Referral.svelte';
	import Step4WaitingList from '$lib/components/steps/Step4WaitingList.svelte';
	import Step5Appointment from '$lib/components/steps/Step5Appointment.svelte';
	import Step6Communication from '$lib/components/steps/Step6Communication.svelte';
	import Step7Signoff from '$lib/components/steps/Step7Signoff.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample card (existing id) or a blank
	// draft (new).
	$effect(() => {
		const seed = sampleCards.find((s) => s.id === id)?.data;
		if (store.id !== id) {
			store.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = store.data;
		const found: { id: string; message: string }[] = [];
		if (d.patient.name.trim() === '') {
			found.push({ id: 'patient-name', message: 'Patient name is required.' });
		}
		if (d.waitingList.clinicalPriority === '') {
			found.push({
				id: 'waiting-clinical-priority',
				message: 'Clinical priority is required to compute the Waiting Time Status.'
			});
		}
		if (d.waitingList.rttClockStartDate === null) {
			found.push({
				id: 'waiting-rtt-clock-start',
				message: 'RTT clock-start date is required to compute the Waiting Time Status.'
			});
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		store.result = calculateWaitingTimeStatus(store.data);
		goto(`/public-health-waiting-list-card/public-health-waiting-list-cards/${id}/report`);
	}

	function startOver() {
		const seed = sampleCards.find((s) => s.id === id)?.data;
		store.reset();
		store.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-auto max-w-3xl px-4 py-6">
	<header class="mb-6 no-print">
		<h1 class="text-2xl font-bold text-base-content">
			{isNew ? 'New waiting list card' : `Waiting list card ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the seven sections; the Waiting Time Status and flagged issues are computed on submit.
		</p>
		<Progress label="Card sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Card sections" current={TOTAL_STEPS}>
			{#each STEPS as step (step.number)}
				<StepListItem status="finished" label={step.title}>{step.shortTitle}</StepListItem>
			{/each}
		</StepList>
	</header>

	{#if errors.length > 0}
		<ErrorSummary title="Please fix the following before submitting" class="mb-6">
			<ul>
				{#each errors as e (e.id)}
					<li><a href={`#${e.id}`}>{e.message}</a></li>
				{/each}
			</ul>
		</ErrorSummary>
	{/if}

	<Form label="Waiting list card" onsubmit={submit}>
		<Step1Practitioner />
		<Step2Patient />
		<Step3Referral />
		<Step4WaitingList />
		<Step5Appointment />
		<Step6Communication />
		<Step7Signoff />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute status &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
