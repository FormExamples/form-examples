<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeFirstAid } from '#lib/engine/first-aid-grader.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1TraineeDetails from '#lib/components/steps/Step1TraineeDetails.svelte';
	import Step2SceneAssessmentSafety from '#lib/components/steps/Step2SceneAssessmentSafety.svelte';
	import Step3PrimarySurveyDRABC from '#lib/components/steps/Step3PrimarySurveyDRABC.svelte';
	import Step4CPRAED from '#lib/components/steps/Step4CPRAED.svelte';
	import Step5ChokingManagement from '#lib/components/steps/Step5ChokingManagement.svelte';
	import Step6BleedingWoundCare from '#lib/components/steps/Step6BleedingWoundCare.svelte';
	import Step7BurnsScalds from '#lib/components/steps/Step7BurnsScalds.svelte';
	import Step8FracturesSprainsSpinal from '#lib/components/steps/Step8FracturesSprainsSpinal.svelte';
	import Step9MedicalEmergencies from '#lib/components/steps/Step9MedicalEmergencies.svelte';
	import Step10RecordingReportingHandover from '#lib/components/steps/Step10RecordingReportingHandover.svelte';

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
		const d = assessment.data.traineeDetails;
		const found: { id: string; message: string }[] = [];
		if (d.lastName.trim() === '') {
			found.push({ id: 'lastName', message: 'Trainee last name is required.' });
		}
		if (d.sessionDate === '') {
			found.push({ id: 'sessionDate', message: 'Session date is required.' });
		}
		if (d.examinerName.trim() === '') {
			found.push({ id: 'examinerName', message: 'Examiner name is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = gradeFirstAid(assessment.data);
		goto(`/first-aid-training-checklist/first-aid-training-checklists/${id}/report`);
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
		{isNew ? 'New first aid assessment' : `First aid assessment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the ten sections; the Pass / Needs Development / Fail outcome is computed on submit.
	</p>
	<Progress label="Assessment sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Assessment sections" current={TOTAL_STEPS}>
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

	<Form label="First aid training checklist" onsubmit={submit}>
		<Step1TraineeDetails />
		<Step2SceneAssessmentSafety />
		<Step3PrimarySurveyDRABC />
		<Step4CPRAED />
		<Step5ChokingManagement />
		<Step6BleedingWoundCare />
		<Step7BurnsScalds />
		<Step8FracturesSprainsSpinal />
		<Step9MedicalEmergencies />
		<Step10RecordingReportingHandover />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute outcome &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
