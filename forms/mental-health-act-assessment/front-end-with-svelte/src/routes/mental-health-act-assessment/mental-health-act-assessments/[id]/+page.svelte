<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeMentalHealthActAssessment } from '$lib/engine/mha-grader';
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
	import Step3Professionals from '$lib/components/steps/Step3Professionals.svelte';
	import Step4MentalDisorder from '$lib/components/steps/Step4MentalDisorder.svelte';
	import Step5Risk from '$lib/components/steps/Step5Risk.svelte';
	import Step6LeastRestrictive from '$lib/components/steps/Step6LeastRestrictive.svelte';
	import Step7Treatment from '$lib/components/steps/Step7Treatment.svelte';
	import Step8NearestRelative from '$lib/components/steps/Step8NearestRelative.svelte';
	import Step9Recommendation from '$lib/components/steps/Step9Recommendation.svelte';

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
		if (d.identification.personIdentifier.trim() === '') {
			found.push({
				id: 'identification-personIdentifier',
				message: 'Person identifier is required.'
			});
		}
		if (d.recommendation.recommendedSection === '') {
			found.push({
				id: 'recommendation-recommendedSection',
				message: 'A recommended section (or None) is required.'
			});
		}
		if (d.recommendation.outcome === '') {
			found.push({ id: 'recommendation-outcome', message: 'An outcome is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = gradeMentalHealthActAssessment(assessment.data);
		goto(`/mental-health-act-assessment/mental-health-act-assessments/${id}/report`);
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
			{isNew ? 'New Mental Health Act assessment' : `MHA assessment ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the nine sections; the section classification, completeness status, and urgency are
			computed on submit. This is a documentation instrument — there is no numeric score and no
			automated decision to detain.
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

	<Form label="Mental Health Act assessment" onsubmit={submit}>
		<Step1Context />
		<Step2Identification />
		<Step3Professionals />
		<Step4MentalDisorder />
		<Step5Risk />
		<Step6LeastRestrictive />
		<Step7Treatment />
		<Step8NearestRelative />
		<Step9Recommendation />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Validate &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
