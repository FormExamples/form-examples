<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateClavienDindo } from '$lib/engine/clavien-dindo-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1PatientDetails from '$lib/components/steps/Step1PatientDetails.svelte';
	import Step2ProcedureDetails from '$lib/components/steps/Step2ProcedureDetails.svelte';
	import Step3SurgicalTeam from '$lib/components/steps/Step3SurgicalTeam.svelte';
	import Step4IntraoperativeFindings from '$lib/components/steps/Step4IntraoperativeFindings.svelte';
	import Step5AnaesthesiaSummary from '$lib/components/steps/Step5AnaesthesiaSummary.svelte';
	import Step6BloodLossFluidBalance from '$lib/components/steps/Step6BloodLossFluidBalance.svelte';
	import Step7SpecimensImplants from '$lib/components/steps/Step7SpecimensImplants.svelte';
	import Step8ImmediatePostopStatus from '$lib/components/steps/Step8ImmediatePostopStatus.svelte';
	import Step9ComplicationsAssessment from '$lib/components/steps/Step9ComplicationsAssessment.svelte';
	import Step10PostopPlanInstructions from '$lib/components/steps/Step10PostopPlanInstructions.svelte';

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
		if (d.patientDetails.lastName.trim() === '') {
			found.push({ id: 'lastName', message: 'Patient last name is required.' });
		}
		if (d.patientDetails.dateOfBirth === '') {
			found.push({ id: 'dob', message: 'Date of birth is required.' });
		}
		if (d.procedureDetails.procedureName.trim() === '') {
			found.push({ id: 'procedureName', message: 'Procedure name is required.' });
		}
		if (d.procedureDetails.dateOfSurgery === '') {
			found.push({ id: 'dateOfSurgery', message: 'Date of surgery is required.' });
		}
		if (d.surgicalTeam.primarySurgeon.trim() === '') {
			found.push({ id: 'primarySurgeon', message: 'Primary surgeon is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateClavienDindo(assessment.data);
		goto(`/post-operative-report/post-operative-reports/${id}/report`);
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
		{isNew ? 'New post-operative report' : `Post-operative report ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the ten sections; the overall Clavien-Dindo grade and flagged issues are computed on
		submit.
	</p>
	<Progress label="Report sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Report sections" current={TOTAL_STEPS}>
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

	<Form label="Post-operative report" onsubmit={submit}>
		<Step1PatientDetails />
		<Step2ProcedureDetails />
		<Step3SurgicalTeam />
		<Step4IntraoperativeFindings />
		<Step5AnaesthesiaSummary />
		<Step6BloodLossFluidBalance />
		<Step7SpecimensImplants />
		<Step8ImmediatePostopStatus />
		<Step9ComplicationsAssessment />
		<Step10PostopPlanInstructions />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
