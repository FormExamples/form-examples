<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateNipeGrade } from '$lib/engine/nipe-grader';
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
	import Step3RiskFactors from '$lib/components/steps/Step3RiskFactors.svelte';
	import Step4Eyes from '$lib/components/steps/Step4Eyes.svelte';
	import Step5Heart from '$lib/components/steps/Step5Heart.svelte';
	import Step6Hips from '$lib/components/steps/Step6Hips.svelte';
	import Step7Testes from '$lib/components/steps/Step7Testes.svelte';
	import Step8Systematic from '$lib/components/steps/Step8Systematic.svelte';
	import Step9Summary from '$lib/components/steps/Step9Summary.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample examination (existing id) or a
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
		if (d.context.practitionerName.trim() === '') {
			found.push({
				id: 'context-practitionerName',
				message: 'Examining practitioner name is required.'
			});
		}
		if (d.context.examinationContext === '') {
			found.push({ id: 'context-examinationContext', message: 'Examination context is required.' });
		}
		if (d.identification.babyIdentifier.trim() === '') {
			found.push({
				id: 'identification-babyIdentifier',
				message: 'NHS number or local identifier is required.'
			});
		}
		if (d.identification.sex === '') {
			found.push({ id: 'identification-sex', message: 'Sex is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateNipeGrade(assessment.data);
		goto(`/newborn-and-infant-physical-examination/newborn-and-infant-physical-examinations/${id}/report`);
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
		{isNew ? 'New NIPE examination' : `NIPE examination ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the nine sections; the screening outcome is computed on submit. This is a
		classification form — there is no numeric score.
	</p>
	<Progress label="Examination sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Examination sections" current={TOTAL_STEPS}>
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

	<Form label="NIPE examination" onsubmit={submit}>
		<Step1Context />
		<Step2Identification />
		<Step3RiskFactors />
		<Step4Eyes />
		<Step5Heart />
		<Step6Hips />
		<Step7Testes />
		<Step8Systematic />
		<Step9Summary />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Classify &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
