<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateOnboardingGrade } from '$lib/engine/onboarding-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2PreEmploymentChecks from '$lib/components/steps/Step2PreEmploymentChecks.svelte';
	import Step3OccupationalHealth from '$lib/components/steps/Step3OccupationalHealth.svelte';
	import Step4MandatoryTraining from '$lib/components/steps/Step4MandatoryTraining.svelte';
	import Step5ProfessionalRegistration from '$lib/components/steps/Step5ProfessionalRegistration.svelte';
	import Step6ITSystemsAccess from '$lib/components/steps/Step6ITSystemsAccess.svelte';
	import Step7UniformIDBadge from '$lib/components/steps/Step7UniformIDBadge.svelte';
	import Step8InductionProgramme from '$lib/components/steps/Step8InductionProgramme.svelte';
	import Step9ProbationSupervision from '$lib/components/steps/Step9ProbationSupervision.svelte';
	import Step10SignOffCompliance from '$lib/components/steps/Step10SignOffCompliance.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample checklist (existing id) or a
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
		if (d.demographics.firstName.trim() === '') {
			found.push({ id: 'firstName', message: 'Employee first name is required.' });
		}
		if (d.demographics.lastName.trim() === '') {
			found.push({ id: 'lastName', message: 'Employee last name is required.' });
		}
		if (d.demographics.jobTitle.trim() === '') {
			found.push({ id: 'jobTitle', message: 'Job title is required.' });
		}
		if (d.demographics.department.trim() === '') {
			found.push({ id: 'department', message: 'Department is required.' });
		}
		if (d.demographics.startDate === '') {
			found.push({ id: 'startDate', message: 'Start date is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateOnboardingGrade(assessment.data);
		goto(`/employee-onboarding-checklist/employee-onboarding-checklists/${id}/report`);
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
			{isNew ? 'New onboarding checklist' : `Onboarding checklist ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the ten sections; the completion status and overall risk are computed on submit.
		</p>
		<Progress label="Checklist sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Checklist sections" current={TOTAL_STEPS}>
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

	<Form label="Employee onboarding checklist" onsubmit={submit}>
		<Step1Demographics />
		<Step2PreEmploymentChecks />
		<Step3OccupationalHealth />
		<Step4MandatoryTraining />
		<Step5ProfessionalRegistration />
		<Step6ITSystemsAccess />
		<Step7UniformIDBadge />
		<Step8InductionProgramme />
		<Step9ProbationSupervision />
		<Step10SignOffCompliance />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute status &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
