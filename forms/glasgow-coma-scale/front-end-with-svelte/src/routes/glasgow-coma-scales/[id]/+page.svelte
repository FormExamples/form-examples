<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateGcsGrade } from '$lib/engine/gcs-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Context from '$lib/components/steps/Step1Context.svelte';
	import Step2Confounders from '$lib/components/steps/Step2Confounders.svelte';
	import Step3Eye from '$lib/components/steps/Step3Eye.svelte';
	import Step4Verbal from '$lib/components/steps/Step4Verbal.svelte';
	import Step5Motor from '$lib/components/steps/Step5Motor.svelte';
	import Step6Pupils from '$lib/components/steps/Step6Pupils.svelte';
	import Step7Trend from '$lib/components/steps/Step7Trend.svelte';
	import Step8Summary from '$lib/components/steps/Step8Summary.svelte';

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
		if (d.context.assessorName.trim() === '') {
			found.push({ id: 'context-assessorName', message: 'Assessing observer name is required.' });
		}
		if (d.context.setting === '') {
			found.push({ id: 'context-setting', message: 'Care setting is required.' });
		}
		if (d.eye.eyeResponse === '') {
			found.push({ id: 'eye-eyeResponse', message: 'Eye opening response is required.' });
		}
		if (d.verbal.verbalResponse === '') {
			found.push({ id: 'verbal-verbalResponse', message: 'Verbal response is required.' });
		}
		if (d.motor.motorResponse === '') {
			found.push({ id: 'motor-motorResponse', message: 'Motor response is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateGcsGrade(assessment.data);
		goto(`/glasgow-coma-scales/${id}/report`);
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
			{isNew ? 'New GCS assessment' : `GCS assessment ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the eight sections; the total GCS, severity band, and GCS-Pupils are computed on
			submit.
		</p>
		<Progress label="Assessment sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Assessment sections" current={TOTAL_STEPS}>
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

	<Form label="GCS assessment" onsubmit={submit}>
		<Step1Context />
		<Step2Confounders />
		<Step3Eye />
		<Step4Verbal />
		<Step5Motor />
		<Step6Pupils />
		<Step7Trend />
		<Step8Summary />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute score &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
