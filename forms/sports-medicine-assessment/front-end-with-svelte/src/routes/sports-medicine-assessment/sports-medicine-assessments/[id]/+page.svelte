<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradePPE } from '$lib/engine/ppe-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2SportPositionDetails from '$lib/components/steps/Step2SportPositionDetails.svelte';
	import Step3MedicalHistory from '$lib/components/steps/Step3MedicalHistory.svelte';
	import Step4FamilyHistory from '$lib/components/steps/Step4FamilyHistory.svelte';
	import Step5MenstrualHistoryREDS from '$lib/components/steps/Step5MenstrualHistoryREDS.svelte';
	import Step6CardiovascularScreening from '$lib/components/steps/Step6CardiovascularScreening.svelte';
	import Step7MusculoskeletalScreening from '$lib/components/steps/Step7MusculoskeletalScreening.svelte';
	import Step8NeurologicalConcussionBaseline from '$lib/components/steps/Step8NeurologicalConcussionBaseline.svelte';
	import Step9VisionSkin from '$lib/components/steps/Step9VisionSkin.svelte';
	import Step10ClearanceDecision from '$lib/components/steps/Step10ClearanceDecision.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample assessment (existing id) or a
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
		if (d.demographics.lastName.trim() === '') {
			found.push({ id: 'lastName', message: 'Athlete last name is required.' });
		}
		if (d.demographics.dateOfBirth === '') {
			found.push({ id: 'dob', message: 'Date of birth is required.' });
		}
		if (d.demographics.sex === '') {
			found.push({ id: 'sex', message: 'Sex is required for RED-S screening logic.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = gradePPE(assessment.data);
		goto(`/sports-medicine-assessment/sports-medicine-assessments/${id}/report`);
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
		{isNew ? 'New sports medicine assessment' : `Sports medicine assessment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the ten sections; the PPE clearance decision and flagged issues are computed on submit.
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

	<Form label="Sports medicine assessment" onsubmit={submit}>
		<Step1Demographics />
		<Step2SportPositionDetails />
		<Step3MedicalHistory />
		<Step4FamilyHistory />
		<Step5MenstrualHistoryREDS />
		<Step6CardiovascularScreening />
		<Step7MusculoskeletalScreening />
		<Step8NeurologicalConcussionBaseline />
		<Step9VisionSkin />
		<Step10ClearanceDecision />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute clearance &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
