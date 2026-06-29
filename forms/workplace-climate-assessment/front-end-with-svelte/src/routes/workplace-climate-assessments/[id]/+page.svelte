<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeClimate } from '$lib/engine/grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2LeadershipManagement from '$lib/components/steps/Step2LeadershipManagement.svelte';
	import Step3PsychologicalSafety from '$lib/components/steps/Step3PsychologicalSafety.svelte';
	import Step4InclusionBelonging from '$lib/components/steps/Step4InclusionBelonging.svelte';
	import Step5Communication from '$lib/components/steps/Step5Communication.svelte';
	import Step6CollaborationTeamwork from '$lib/components/steps/Step6CollaborationTeamwork.svelte';
	import Step7RecognitionReward from '$lib/components/steps/Step7RecognitionReward.svelte';
	import Step8Wellbeing from '$lib/components/steps/Step8Wellbeing.svelte';
	import Step9CareerDevelopment from '$lib/components/steps/Step9CareerDevelopment.svelte';
	import Step10OverallClimate from '$lib/components/steps/Step10OverallClimate.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample response (existing id) or a
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
		if (d.demographics.department === '') {
			found.push({ id: 'department', message: 'Please choose a department / function.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = gradeClimate(assessment.data);
		goto(`/workplace-climate-assessments/${id}/report`);
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
			{isNew ? 'New workplace climate response' : `Workplace climate response ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Your responses are anonymous. Complete the ten short sections; the Workplace Climate Index and
			flagged issues are computed on submit.
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

	<Form label="Workplace climate assessment" onsubmit={submit}>
		<Step1Demographics />
		<Step2LeadershipManagement />
		<Step3PsychologicalSafety />
		<Step4InclusionBelonging />
		<Step5Communication />
		<Step6CollaborationTeamwork />
		<Step7RecognitionReward />
		<Step8Wellbeing />
		<Step9CareerDevelopment />
		<Step10OverallClimate />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute index &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
