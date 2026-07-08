<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateRespectGrade } from '$lib/engine/respect-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Personal from '$lib/components/steps/Step1Personal.svelte';
	import Step2Health from '$lib/components/steps/Step2Health.svelte';
	import Step3Preferences from '$lib/components/steps/Step3Preferences.svelte';
	import Step4Recommendations from '$lib/components/steps/Step4Recommendations.svelte';
	import Step5Cpr from '$lib/components/steps/Step5Cpr.svelte';
	import Step6Ceilings from '$lib/components/steps/Step6Ceilings.svelte';
	import Step7Capacity from '$lib/components/steps/Step7Capacity.svelte';
	import Step8SignOff from '$lib/components/steps/Step8SignOff.svelte';
	import Step9Summary from '$lib/components/steps/Step9Summary.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample plan (existing id) or a blank
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
		if (d.personal.personName.trim() === '') {
			found.push({ id: 'personal-personName', message: 'Name of the person is required.' });
		}
		if (d.personal.dateOfBirth.trim() === '') {
			found.push({ id: 'personal-dateOfBirth', message: 'Date of birth is required.' });
		}
		if (d.personal.identifier.trim() === '') {
			found.push({ id: 'personal-identifier', message: 'An identifier is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateRespectGrade(assessment.data);
		goto(`/recommended-summary-plan-for-emergency-care-and-treatment/plans/${id}/report`);
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
			{isNew ? 'New ReSPECT plan' : `ReSPECT plan ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the nine sections; the completeness status and flags are computed on submit.
		</p>
		<Progress label="Plan sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Plan sections" current={TOTAL_STEPS}>
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

	<Form label="ReSPECT plan" onsubmit={submit}>
		<Step1Personal />
		<Step2Health />
		<Step3Preferences />
		<Step4Recommendations />
		<Step5Cpr />
		<Step6Ceilings />
		<Step7Capacity />
		<Step8SignOff />
		<Step9Summary />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Check plan &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
