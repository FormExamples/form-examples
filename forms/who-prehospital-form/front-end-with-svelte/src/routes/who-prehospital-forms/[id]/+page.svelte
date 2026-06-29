<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradePrehospital } from '$lib/engine/prehospital-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1CallerAndScene from '$lib/components/steps/Step1CallerAndScene.svelte';
	import Step2ChiefComplaintAndVitals from '$lib/components/steps/Step2ChiefComplaintAndVitals.svelte';
	import Step3HighRiskSigns from '$lib/components/steps/Step3HighRiskSigns.svelte';
	import Step4Triage from '$lib/components/steps/Step4Triage.svelte';
	import Step5Airway from '$lib/components/steps/Step5Airway.svelte';
	import Step6Breathing from '$lib/components/steps/Step6Breathing.svelte';
	import Step7Circulation from '$lib/components/steps/Step7Circulation.svelte';
	import Step8Disability from '$lib/components/steps/Step8Disability.svelte';
	import Step9Exposure from '$lib/components/steps/Step9Exposure.svelte';
	import Step10SampleHistory from '$lib/components/steps/Step10SampleHistory.svelte';
	import Step11InjuryDetails from '$lib/components/steps/Step11InjuryDetails.svelte';
	import Step12PhysicalExam from '$lib/components/steps/Step12PhysicalExam.svelte';
	import Step13AdditionalInterventions from '$lib/components/steps/Step13AdditionalInterventions.svelte';
	import Step14AssessmentAndPlan from '$lib/components/steps/Step14AssessmentAndPlan.svelte';
	import Step15Reassessment from '$lib/components/steps/Step15Reassessment.svelte';
	import Step16Disposition from '$lib/components/steps/Step16Disposition.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample encounter (existing id) or a
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
		if (d.callerAndScene.patientName.trim() === '') {
			found.push({ id: 'patientName', message: 'Patient name is required.' });
		}
		if (d.disposition.providerName.trim() === '') {
			found.push({ id: 'providerName', message: 'Provider name is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = gradePrehospital(assessment.data);
		goto(`/who-prehospital-forms/${id}/report`);
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
			{isNew ? 'New prehospital encounter' : `Prehospital encounter ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the sixteen sections; triage category, completeness and flagged issues are computed
			on submit.
		</p>
		<Progress label="Encounter sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Encounter sections" current={TOTAL_STEPS}>
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

	<Form label="Prehospital encounter" onsubmit={submit}>
		<Step1CallerAndScene />
		<Step2ChiefComplaintAndVitals />
		<Step3HighRiskSigns />
		<Step4Triage />
		<Step5Airway />
		<Step6Breathing />
		<Step7Circulation />
		<Step8Disability />
		<Step9Exposure />
		<Step10SampleHistory />
		<Step11InjuryDetails />
		<Step12PhysicalExam />
		<Step13AdditionalInterventions />
		<Step14AssessmentAndPlan />
		<Step15Reassessment />
		<Step16Disposition />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Check &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
