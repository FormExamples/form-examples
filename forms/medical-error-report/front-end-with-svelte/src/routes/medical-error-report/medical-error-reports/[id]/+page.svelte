<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateErrorGrade } from '$lib/engine/error-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2IncidentDetails from '$lib/components/steps/Step2IncidentDetails.svelte';
	import Step3PatientInvolvement from '$lib/components/steps/Step3PatientInvolvement.svelte';
	import Step4ErrorClassification from '$lib/components/steps/Step4ErrorClassification.svelte';
	import Step5ContributingFactors from '$lib/components/steps/Step5ContributingFactors.svelte';
	import Step6ImmediateActions from '$lib/components/steps/Step6ImmediateActions.svelte';
	import Step7PatientOutcome from '$lib/components/steps/Step7PatientOutcome.svelte';
	import Step8RootCauseAnalysis from '$lib/components/steps/Step8RootCauseAnalysis.svelte';
	import Step9CorrectiveActions from '$lib/components/steps/Step9CorrectiveActions.svelte';
	import Step10ReportingFollowup from '$lib/components/steps/Step10ReportingFollowup.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample report (existing id) or a
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
		if (d.demographics.facilityName.trim() === '') {
			found.push({ id: 'facilityName', message: 'Facility name is required.' });
		}
		if (d.demographics.reportDate === '') {
			found.push({ id: 'reportDate', message: 'Report date is required.' });
		}
		if (d.incidentDetails.incidentDate === '') {
			found.push({ id: 'incidentDate', message: 'Incident date is required.' });
		}
		if (d.incidentDetails.incidentSummary.trim() === '') {
			found.push({ id: 'incidentSummary', message: 'Incident summary is required.' });
		}
		if (d.errorClassification.errorType === '') {
			found.push({ id: 'errorType', message: 'Error type is required.' });
		}
		if (d.errorClassification.whoSeverity === '') {
			found.push({ id: 'whoSeverity', message: 'WHO severity is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateErrorGrade(assessment.data);
		goto(`/medical-error-report/medical-error-reports/${id}/report`);
	}

	function startOver() {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
		assessment.reset();
		assessment.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-auto max-w-3xl px-4 py-6">
	<header class="mb-6 no-print">
		<h1 class="text-2xl font-bold text-base-content">
			{isNew ? 'New medical error report' : `Medical error report ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the ten sections; the WHO severity, NCC MERP category, and overall risk are computed on
			submit.
		</p>
		<Progress label="Report sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Report sections" current={TOTAL_STEPS}>
			{#each steps as step (step.number)}
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

	<Form label="Medical error report" onsubmit={submit}>
		<Step1Demographics />
		<Step2IncidentDetails />
		<Step3PatientInvolvement />
		<Step4ErrorClassification />
		<Step5ContributingFactors />
		<Step6ImmediateActions />
		<Step7PatientOutcome />
		<Step8RootCauseAnalysis />
		<Step9CorrectiveActions />
		<Step10ReportingFollowup />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Classify &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
