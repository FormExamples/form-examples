<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeSafety } from '#lib/engine/safety-grader.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1SiteDetails from '#lib/components/steps/Step1SiteDetails.svelte';
	import Step2PPEHazardControls from '#lib/components/steps/Step2PPEHazardControls.svelte';
	import Step3ChemicalBiologicalHazards from '#lib/components/steps/Step3ChemicalBiologicalHazards.svelte';
	import Step4ElectricalSafety from '#lib/components/steps/Step4ElectricalSafety.svelte';
	import Step5FireSafety from '#lib/components/steps/Step5FireSafety.svelte';
	import Step6ErgonomicsManualHandling from '#lib/components/steps/Step6ErgonomicsManualHandling.svelte';
	import Step7EmergencyProcedures from '#lib/components/steps/Step7EmergencyProcedures.svelte';
	import Step8TrainingCompetence from '#lib/components/steps/Step8TrainingCompetence.svelte';
	import Step9IncidentReporting from '#lib/components/steps/Step9IncidentReporting.svelte';
	import Step10SignoffActionPlan from '#lib/components/steps/Step10SignoffActionPlan.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample audit (existing id) or a
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
		if (d.siteDetails.auditorName.trim() === '') {
			found.push({ id: 'auditorName', message: 'Auditor name is required.' });
		}
		if (d.siteDetails.siteName.trim() === '') {
			found.push({ id: 'siteName', message: 'Site name is required.' });
		}
		if (d.siteDetails.auditDate === '') {
			found.push({ id: 'auditDate', message: 'Audit date is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = gradeSafety(assessment.data);
		goto(`/workplace-safety-assessment/workplace-safety-assessments/${id}/report`);
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
		{isNew ? 'New workplace safety audit' : `Workplace safety audit ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the ten sections; the overall outcome and findings are computed on submit.
	</p>
	<Progress label="Audit sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Audit sections" current={TOTAL_STEPS}>
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

	<Form label="Workplace safety assessment" onsubmit={submit}>
		<Step1SiteDetails />
		<Step2PPEHazardControls />
		<Step3ChemicalBiologicalHazards />
		<Step4ElectricalSafety />
		<Step5FireSafety />
		<Step6ErgonomicsManualHandling />
		<Step7EmergencyProcedures />
		<Step8TrainingCompetence />
		<Step9IncidentReporting />
		<Step10SignoffActionPlan />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute outcome &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
