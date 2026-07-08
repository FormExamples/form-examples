<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { review } from '$lib/engine/ckd-review-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Context from '$lib/components/steps/Step1Context.svelte';
	import Step2Patient from '$lib/components/steps/Step2Patient.svelte';
	import Step3Renal from '$lib/components/steps/Step3Renal.svelte';
	import Step4Albuminuria from '$lib/components/steps/Step4Albuminuria.svelte';
	import Step5BloodPressure from '$lib/components/steps/Step5BloodPressure.svelte';
	import Step6Medication from '$lib/components/steps/Step6Medication.svelte';
	import Step7Bloods from '$lib/components/steps/Step7Bloods.svelte';
	import Step8Summary from '$lib/components/steps/Step8Summary.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample review (existing id) or a
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
		if (d.context.clinicianName.trim() === '') {
			found.push({
				id: 'context-clinicianName',
				message: 'Reviewing clinician name is required.'
			});
		}
		if (d.context.clinicianRole === '') {
			found.push({ id: 'context-clinicianRole', message: 'Clinician role is required.' });
		}
		if (d.patient.patientIdentifier.trim() === '') {
			found.push({
				id: 'patient-patientIdentifier',
				message: 'Patient identifier is required.'
			});
		}
		if (d.patient.ageBand === '') {
			found.push({ id: 'patient-ageBand', message: 'Age band is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = review(assessment.data);
		goto(`/chronic-kidney-disease-review/chronic-kidney-disease-reviews/${id}/report`);
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
			{isNew ? 'New chronic kidney disease review' : `CKD review ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the eight sections; the KDIGO G-stage, albuminuria stage, risk zone, and review
			completeness are computed on submit. This is a documentation and classification instrument —
			there is no numeric score.
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

	<Form label="Chronic kidney disease review" onsubmit={submit}>
		<Step1Context />
		<Step2Patient />
		<Step3Renal />
		<Step4Albuminuria />
		<Step5BloodPressure />
		<Step6Medication />
		<Step7Bloods />
		<Step8Summary />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
