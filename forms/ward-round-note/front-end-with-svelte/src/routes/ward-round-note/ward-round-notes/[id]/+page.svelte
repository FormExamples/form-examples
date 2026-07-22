<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateWardRoundGrade } from '$lib/engine/ward-round-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Header from '$lib/components/steps/Step1Header.svelte';
	import Step2Identification from '$lib/components/steps/Step2Identification.svelte';
	import Step3Overnight from '$lib/components/steps/Step3Overnight.svelte';
	import Step4Problems from '$lib/components/steps/Step4Problems.svelte';
	import Step5Examination from '$lib/components/steps/Step5Examination.svelte';
	import Step6Investigations from '$lib/components/steps/Step6Investigations.svelte';
	import Step7Vte from '$lib/components/steps/Step7Vte.svelte';
	import Step8Medication from '$lib/components/steps/Step8Medication.svelte';
	import Step9Plan from '$lib/components/steps/Step9Plan.svelte';
	import Step10Escalation from '$lib/components/steps/Step10Escalation.svelte';
	import Step11Summary from '$lib/components/steps/Step11Summary.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample note (existing id) or a blank
	// draft (new).
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
		if (d.header.clinicianName.trim() === '') {
			found.push({ id: 'header-clinicianName', message: 'Reviewing clinician name is required.' });
		}
		if (d.header.clinicianGrade === '') {
			found.push({ id: 'header-clinicianGrade', message: 'Clinician grade is required.' });
		}
		if (d.header.reviewedAt.trim() === '') {
			found.push({ id: 'header-reviewedAt', message: 'Date and time of review is required.' });
		}
		if (d.identification.patientIdentifier.trim() === '') {
			found.push({
				id: 'identification-patientIdentifier',
				message: 'Patient identifier is required.'
			});
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateWardRoundGrade(assessment.data);
		goto(`/ward-round-note/ward-round-notes/${id}/report`);
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
		{isNew ? 'New ward round note' : `Ward round note ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the eleven sections; completeness is computed on submit. This is a documentation
		instrument — there is no numeric score.
	</p>
	<Progress label="Note sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Note sections" current={TOTAL_STEPS}>
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

	<Form label="Ward round note" onsubmit={submit}>
		<Step1Header />
		<Step2Identification />
		<Step3Overnight />
		<Step4Problems />
		<Step5Examination />
		<Step6Investigations />
		<Step7Vte />
		<Step8Medication />
		<Step9Plan />
		<Step10Escalation />
		<Step11Summary />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
