<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateControl } from '$lib/engine/diabetes-grader';
	import { detectAdditionalFlags } from '$lib/engine/flagged-issues';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1PatientInformation from '$lib/components/steps/Step1PatientInformation.svelte';
	import Step2DiabetesHistory from '$lib/components/steps/Step2DiabetesHistory.svelte';
	import Step3GlycaemicControl from '$lib/components/steps/Step3GlycaemicControl.svelte';
	import Step4Medications from '$lib/components/steps/Step4Medications.svelte';
	import Step5ComplicationsScreening from '$lib/components/steps/Step5ComplicationsScreening.svelte';
	import Step6CardiovascularRisk from '$lib/components/steps/Step6CardiovascularRisk.svelte';
	import Step7SelfCareLifestyle from '$lib/components/steps/Step7SelfCareLifestyle.svelte';
	import Step8PsychologicalWellbeing from '$lib/components/steps/Step8PsychologicalWellbeing.svelte';
	import Step9FootAssessment from '$lib/components/steps/Step9FootAssessment.svelte';
	import Step10ReviewCarePlan from '$lib/components/steps/Step10ReviewCarePlan.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

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
		if (d.patientInformation.fullName.trim() === '') {
			found.push({ id: 'fullName', message: 'Patient name is required.' });
		}
		if (d.patientInformation.dateOfBirth === '') {
			found.push({ id: 'dateOfBirth', message: 'Date of birth is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		const { controlLevel, controlScore, firedRules } = calculateControl(assessment.data);
		assessment.result = {
			controlLevel,
			controlScore,
			firedRules,
			additionalFlags: detectAdditionalFlags(assessment.data),
			timestamp: new Date().toISOString()
		};
		goto(`/diabetes-assessment/diabetes-assessments/${id}/report`);
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
			{isNew ? 'New diabetes review' : `Diabetes review ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the ten sections; the control level and composite score are computed on submit.
		</p>
		<Progress label="Review sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Review sections" current={TOTAL_STEPS}>
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

	<Form label="Diabetes review" onsubmit={submit}>
		<Step1PatientInformation />
		<Step2DiabetesHistory />
		<Step3GlycaemicControl />
		<Step4Medications />
		<Step5ComplicationsScreening />
		<Step6CardiovascularRisk />
		<Step7SelfCareLifestyle />
		<Step8PsychologicalWellbeing />
		<Step9FootAssessment />
		<Step10ReviewCarePlan />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute control &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
