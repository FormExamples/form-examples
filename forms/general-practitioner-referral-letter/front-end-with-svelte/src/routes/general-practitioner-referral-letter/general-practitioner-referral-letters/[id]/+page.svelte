<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeReferral } from '$lib/engine/gp-referral-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Referrer from '$lib/components/steps/Step1Referrer.svelte';
	import Step2Patient from '$lib/components/steps/Step2Patient.svelte';
	import Step3Destination from '$lib/components/steps/Step3Destination.svelte';
	import Step4Urgency from '$lib/components/steps/Step4Urgency.svelte';
	import Step5Clinical from '$lib/components/steps/Step5Clinical.svelte';
	import Step6Examination from '$lib/components/steps/Step6Examination.svelte';
	import Step7Medications from '$lib/components/steps/Step7Medications.svelte';
	import Step8Expectations from '$lib/components/steps/Step8Expectations.svelte';
	import Step9Review from '$lib/components/steps/Step9Review.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample referral (existing id) or a
	// blank draft (new).
	$effect(() => {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
		if (assessment.id !== id) {
			assessment.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = assessment.data;
		const found: { id: string; message: string }[] = [];
		if (d.patient.patientIdentifier.trim() === '') {
			found.push({
				id: 'patient-patientIdentifier',
				message: 'A patient identifier is required.'
			});
		}
		if (d.patient.patientName.trim() === '') {
			found.push({ id: 'patient-patientName', message: 'Patient name is required.' });
		}
		if (d.referrer.referrerName.trim() === '') {
			found.push({ id: 'referrer-referrerName', message: 'Referrer name is required.' });
		}
		if (d.destination.referralSpecialty.trim() === '') {
			found.push({
				id: 'destination-referralSpecialty',
				message: 'A referral specialty or service is required.'
			});
		}
		if (d.urgencyInfo.urgency === '') {
			found.push({ id: 'urgencyInfo-urgency', message: 'An urgency classification is required.' });
		}
		if (d.clinical.reasonForReferral.trim() === '') {
			found.push({
				id: 'clinical-reasonForReferral',
				message: 'A reason for the referral is required.'
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
		assessment.result = gradeReferral(assessment.data);
		goto(`/general-practitioner-referral-letter/general-practitioner-referral-letters/${id}/report`);
	}

	function startOver() {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
		assessment.reset();
		assessment.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-16 px-4 py-6">
	<h1 class="text-2xl font-bold text-base-content">
		{isNew ? 'New general practitioner referral letter' : `Referral ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the nine sections; the completeness status, urgency, and flags are computed on
		submit.
	</p>
	<Progress label="Referral sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Referral sections" current={TOTAL_STEPS}>
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

	<Form label="General practitioner referral letter" onsubmit={submit}>
		<Step1Referrer />
		<Step2Patient />
		<Step3Destination />
		<Step4Urgency />
		<Step5Clinical />
		<Step6Examination />
		<Step7Medications />
		<Step8Expectations />
		<Step9Review />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Check referral &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
