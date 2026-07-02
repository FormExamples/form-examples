<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeCarePlan } from '$lib/engine/nursing-care-plan-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleCarePlans } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Context from '$lib/components/steps/Step1Context.svelte';
	import Step2Patient from '$lib/components/steps/Step2Patient.svelte';
	import Step3RiskAssessments from '$lib/components/steps/Step3RiskAssessments.svelte';
	import Step4Problems from '$lib/components/steps/Step4Problems.svelte';
	import Step5Goals from '$lib/components/steps/Step5Goals.svelte';
	import Step6Interventions from '$lib/components/steps/Step6Interventions.svelte';
	import Step7Evaluation from '$lib/components/steps/Step7Evaluation.svelte';
	import Step8Summary from '$lib/components/steps/Step8Summary.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample care plan (existing id) or a
	// blank draft (new).
	$effect(() => {
		const seed = sampleCarePlans.find((s) => s.id === id)?.data;
		if (assessment.id !== id) {
			assessment.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = assessment.data;
		const found: { id: string; message: string }[] = [];
		if (d.planContext.nurseName.trim() === '') {
			found.push({ id: 'context-nurseName', message: 'Authoring nurse name is required.' });
		}
		if (d.planContext.nurseRole === '') {
			found.push({ id: 'context-nurseRole', message: 'Nurse role is required.' });
		}
		if (d.planContext.careSetting === '') {
			found.push({ id: 'context-careSetting', message: 'Care setting is required.' });
		}
		if (d.planContext.planType === '') {
			found.push({ id: 'context-planType', message: 'Plan type is required.' });
		}
		if (d.patient.patientIdentifier.trim() === '') {
			found.push({ id: 'patient-patientIdentifier', message: 'Patient identifier is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = gradeCarePlan(assessment.data);
		goto(`/nursing-care-plans/${id}/report`);
	}

	function startOver() {
		const seed = sampleCarePlans.find((s) => s.id === id)?.data;
		assessment.reset();
		assessment.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-auto max-w-3xl px-4 py-6">
	<header class="mb-6 no-print">
		<h1 class="text-2xl font-bold text-base-content">
			{isNew ? 'New nursing care plan' : `Nursing care plan ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the eight sections; the care-plan status, completeness percent, and flagged issues
			are computed on submit.
		</p>
		<Progress label="Care-plan sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Care-plan sections" current={TOTAL_STEPS}>
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

	<Form label="Nursing care plan" onsubmit={submit}>
		<Step1Context />
		<Step2Patient />
		<Step3RiskAssessments />
		<Step4Problems />
		<Step5Goals />
		<Step6Interventions />
		<Step7Evaluation />
		<Step8Summary />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
