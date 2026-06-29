<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Organization from '$lib/steps/Step1Organization.svelte';
	import Step2Manifesto from '$lib/steps/Step2Manifesto.svelte';
	import Step3PrinciplesA from '$lib/steps/Step3PrinciplesA.svelte';
	import Step4PrinciplesB from '$lib/steps/Step4PrinciplesB.svelte';
	import Step5PrinciplesC from '$lib/steps/Step5PrinciplesC.svelte';
	import Step6ScoreAndSignoff from '$lib/steps/Step6ScoreAndSignoff.svelte';

	const plural = 'agile-consulting-scorecards-for-hiring-help';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample scorecard (existing id) or a
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
		if (d.organization.organizationName.trim() === '') {
			found.push({ id: 'organizationName', message: 'Organization name is required.' });
		}
		if (d.respondent.respondentName.trim() === '') {
			found.push({ id: 'respondentName', message: 'Respondent name is required.' });
		}
		if (d.assessment.assessmentDate === '') {
			found.push({ id: 'assessmentDate', message: 'Assessment date is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		goto(`/${plural}/${id}/report`);
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
			{isNew ? 'New agile consulting scorecard' : `Agile consulting scorecard ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the six sections; the 0–16 score and readiness band are computed as you go.
		</p>
		<Progress label="Scorecard sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Scorecard sections" current={TOTAL_STEPS}>
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

	<Form label="Agile consulting scorecard" onsubmit={submit}>
		<Step1Organization />
		<Step2Manifesto />
		<Step3PrinciplesA />
		<Step4PrinciplesB />
		<Step5PrinciplesC />
		<Step6ScoreAndSignoff />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute score &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
