<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeSatisfaction } from '#lib/engine/grader.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1Demographics from '#lib/components/steps/Step1Demographics.svelte';
	import Step2RoleTenure from '#lib/components/steps/Step2RoleTenure.svelte';
	import Step3WorkloadBalance from '#lib/components/steps/Step3WorkloadBalance.svelte';
	import Step4ManagementLeadership from '#lib/components/steps/Step4ManagementLeadership.svelte';
	import Step5GrowthDevelopment from '#lib/components/steps/Step5GrowthDevelopment.svelte';
	import Step6CompensationBenefits from '#lib/components/steps/Step6CompensationBenefits.svelte';
	import Step7CultureInclusion from '#lib/components/steps/Step7CultureInclusion.svelte';
	import Step8EnvironmentResources from '#lib/components/steps/Step8EnvironmentResources.svelte';
	import Step9RecognitionEngagement from '#lib/components/steps/Step9RecognitionEngagement.svelte';
	import Step10OverallExperience from '#lib/components/steps/Step10OverallExperience.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample survey (existing id) or a
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
			found.push({ id: 'department', message: 'Please select your department.' });
		}
		if (d.demographics.tenureBand === '') {
			found.push({ id: 'tenureBand', message: 'Please select your tenure band.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = gradeSatisfaction(assessment.data);
		goto(`/employee-satisfaction-survey/employee-satisfaction-surveys/${id}/report`);
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
		{isNew ? 'New employee satisfaction survey' : `Employee satisfaction survey ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the ten short sections; your normalised composite score, eNPS and
		flagged issues are computed on submit. Responses are anonymous — please do not
		enter identifying details.
	</p>
	<Progress label="Survey sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Survey sections" current={TOTAL_STEPS}>
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

	<Form label="Employee satisfaction survey" onsubmit={submit}>
		<Step1Demographics />
		<Step2RoleTenure />
		<Step3WorkloadBalance />
		<Step4ManagementLeadership />
		<Step5GrowthDevelopment />
		<Step6CompensationBenefits />
		<Step7CultureInclusion />
		<Step8EnvironmentResources />
		<Step9RecognitionEngagement />
		<Step10OverallExperience />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Submit &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
