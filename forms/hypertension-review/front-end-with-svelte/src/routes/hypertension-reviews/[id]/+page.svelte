<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { review } from '$lib/engine/hypertension-review-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Context from '$lib/components/steps/Step1Context.svelte';
	import Step2Identification from '$lib/components/steps/Step2Identification.svelte';
	import Step3Diagnosis from '$lib/components/steps/Step3Diagnosis.svelte';
	import Step4ClinicBp from '$lib/components/steps/Step4ClinicBp.svelte';
	import Step5HomeBp from '$lib/components/steps/Step5HomeBp.svelte';
	import Step6Medication from '$lib/components/steps/Step6Medication.svelte';
	import Step7CardiovascularRisk from '$lib/components/steps/Step7CardiovascularRisk.svelte';
	import Step8Bloods from '$lib/components/steps/Step8Bloods.svelte';
	import Step9Urine from '$lib/components/steps/Step9Urine.svelte';
	import Step10Lifestyle from '$lib/components/steps/Step10Lifestyle.svelte';
	import Step11Complications from '$lib/components/steps/Step11Complications.svelte';
	import Step12Summary from '$lib/components/steps/Step12Summary.svelte';

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
		if (d.identification.patientIdentifier.trim() === '') {
			found.push({
				id: 'identification-patientIdentifier',
				message: 'Patient identifier is required.'
			});
		}
		if (d.identification.ageBand === '') {
			found.push({ id: 'identification-ageBand', message: 'Age band is required.' });
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
		goto(`/hypertension-reviews/${id}/report`);
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
			{isNew ? 'New hypertension review' : `Hypertension review ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the twelve sections; control status, hypertension stage, and review completeness are
			computed on submit. This is a documentation and control-classification instrument — there is no
			numeric score.
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

	<Form label="Hypertension review" onsubmit={submit}>
		<Step1Context />
		<Step2Identification />
		<Step3Diagnosis />
		<Step4ClinicBp />
		<Step5HomeBp />
		<Step6Medication />
		<Step7CardiovascularRisk />
		<Step8Bloods />
		<Step9Urine />
		<Step10Lifestyle />
		<Step11Complications />
		<Step12Summary />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
