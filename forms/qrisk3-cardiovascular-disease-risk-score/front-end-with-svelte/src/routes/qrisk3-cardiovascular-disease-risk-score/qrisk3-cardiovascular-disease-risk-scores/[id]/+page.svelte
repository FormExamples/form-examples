<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateQrisk3Grade } from '$lib/engine/qrisk3-grader';
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
	import Step3Eligibility from '$lib/components/steps/Step3Eligibility.svelte';
	import Step4Lifestyle from '$lib/components/steps/Step4Lifestyle.svelte';
	import Step5Cardiometabolic from '$lib/components/steps/Step5Cardiometabolic.svelte';
	import Step6Comorbidities from '$lib/components/steps/Step6Comorbidities.svelte';
	import Step7Medication from '$lib/components/steps/Step7Medication.svelte';
	import Step8Summary from '$lib/components/steps/Step8Summary.svelte';

	const plural = 'qrisk3-cardiovascular-disease-risk-scores';

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
		if (d.context.clinicianName.trim() === '') {
			found.push({ id: 'context-clinicianName', message: 'Assessing clinician name is required.' });
		}
		if (d.context.careSetting === '') {
			found.push({ id: 'context-careSetting', message: 'Care setting is required.' });
		}
		if (d.identification.patientIdentifier.trim() === '') {
			found.push({
				id: 'identification-patientIdentifier',
				message: 'Patient identifier is required.'
			});
		}
		if (d.identification.sex === '') {
			found.push({ id: 'identification-sex', message: 'Sex is required to select the model.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateQrisk3Grade(assessment.data);
		goto(`/qrisk3-cardiovascular-disease-risk-score/${plural}/${id}/report`);
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
		{isNew ? 'New QRISK3 assessment' : `QRISK3 assessment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the eight sections; the 10-year CVD risk and risk band are computed on submit.
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

	<Form label="QRISK3 assessment" onsubmit={submit}>
		<Step1Context />
		<Step2Identification />
		<Step3Eligibility />
		<Step4Lifestyle />
		<Step5Cardiometabolic />
		<Step6Comorbidities />
		<Step7Medication />
		<Step8Summary />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute risk &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
