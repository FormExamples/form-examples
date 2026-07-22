<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateGrade } from '$lib/engine/diabetic-eye-grader';
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
	import Step3RightEye from '$lib/components/steps/Step3RightEye.svelte';
	import Step4LeftEye from '$lib/components/steps/Step4LeftEye.svelte';
	import Step5Summary from '$lib/components/steps/Step5Summary.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample screening (existing id) or a
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
		if (d.context.graderName.trim() === '') {
			found.push({ id: 'context-graderName', message: 'Grader name is required.' });
		}
		if (d.context.graderRole === '') {
			found.push({ id: 'context-graderRole', message: 'Grader role is required.' });
		}
		if (d.identification.patientIdentifier.trim() === '') {
			found.push({
				id: 'identification-patientIdentifier',
				message: 'Local patient identifier is required.'
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
		assessment.result = calculateGrade(assessment.data);
		goto(`/diabetic-eye-screening/diabetic-eye-screenings/${id}/report`);
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
		{isNew ? 'New diabetic eye screening' : `Diabetic eye screening ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the five sections; the worst-eye classification and recall pathway are computed on
		submit. This is a classification form — there is no numeric score.
	</p>
	<Progress label="Screening sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Screening sections" current={TOTAL_STEPS}>
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

	<Form label="Diabetic eye screening" onsubmit={submit}>
		<Step1Context />
		<Step2Identification />
		<Step3RightEye />
		<Step4LeftEye />
		<Step5Summary />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Classify &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
