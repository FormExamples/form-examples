<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateHealthCheckGrade } from '$lib/engine/ld-health-check-grader';
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
	import Step3Adjustments from '$lib/components/steps/Step3Adjustments.svelte';
	import Step4PhysicalHealth from '$lib/components/steps/Step4PhysicalHealth.svelte';
	import Step5Screening from '$lib/components/steps/Step5Screening.svelte';
	import Step6Medication from '$lib/components/steps/Step6Medication.svelte';
	import Step7MentalHealth from '$lib/components/steps/Step7MentalHealth.svelte';
	import Step8Syndrome from '$lib/components/steps/Step8Syndrome.svelte';
	import Step9Carer from '$lib/components/steps/Step9Carer.svelte';
	import Step10HealthActionPlan from '$lib/components/steps/Step10HealthActionPlan.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample check (existing id) or a blank
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
		if (d.context.clinicianName.trim() === '') {
			found.push({ id: 'context-clinicianName', message: 'Clinician name is required.' });
		}
		if (d.context.clinicianRole === '') {
			found.push({ id: 'context-clinicianRole', message: 'Clinician role is required.' });
		}
		if (d.context.checkedOn === '') {
			found.push({ id: 'context-checkedOn', message: 'Date of check is required.' });
		}
		if (d.context.practiceName.trim() === '') {
			found.push({ id: 'context-practiceName', message: 'GP practice is required.' });
		}
		if (d.identification.personIdentifier.trim() === '') {
			found.push({
				id: 'identification-personIdentifier',
				message: 'Person identifier is required.'
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
		assessment.result = calculateHealthCheckGrade(assessment.data);
		goto(`/learning-disability-annual-health-check/learning-disability-annual-health-checks/${id}/report`);
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
		{isNew ? 'New annual health check' : `Annual health check ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the ten sections; completeness, the Health Action Plan gate, and clinical flags are
		computed on submit. This is a documentation instrument — there is no numeric score.
	</p>
	<Progress label="Check sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Check sections" current={TOTAL_STEPS}>
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

	<Form label="Annual health check" onsubmit={submit}>
		<Step1Context />
		<Step2Identification />
		<Step3Adjustments />
		<Step4PhysicalHealth />
		<Step5Screening />
		<Step6Medication />
		<Step7MentalHealth />
		<Step8Syndrome />
		<Step9Carer />
		<Step10HealthActionPlan />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
