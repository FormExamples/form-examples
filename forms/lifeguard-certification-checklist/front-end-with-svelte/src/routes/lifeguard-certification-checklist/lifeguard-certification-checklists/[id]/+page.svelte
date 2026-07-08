<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeLifeguard } from '$lib/engine/lifeguard-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1CandidateDetails from '$lib/components/steps/Step1CandidateDetails.svelte';
	import Step2PhysicalFitnessSwim from '$lib/components/steps/Step2PhysicalFitnessSwim.svelte';
	import Step3SupervisionScanningZoning from '$lib/components/steps/Step3SupervisionScanningZoning.svelte';
	import Step4RescueConscious from '$lib/components/steps/Step4RescueConscious.svelte';
	import Step5RescueUnconscious from '$lib/components/steps/Step5RescueUnconscious.svelte';
	import Step6SpinalInjuryManagement from '$lib/components/steps/Step6SpinalInjuryManagement.svelte';
	import Step7CPRAED from '$lib/components/steps/Step7CPRAED.svelte';
	import Step8FirstAidOxygenTherapy from '$lib/components/steps/Step8FirstAidOxygenTherapy.svelte';
	import Step9LegalRegulatoryIncident from '$lib/components/steps/Step9LegalRegulatoryIncident.svelte';
	import Step10OverallResultSignoff from '$lib/components/steps/Step10OverallResultSignoff.svelte';

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
		if (d.candidateDetails.lastName.trim() === '') {
			found.push({ id: 'lastName', message: 'Candidate last name is required.' });
		}
		if (d.candidateDetails.sessionDate === '') {
			found.push({ id: 'sessionDate', message: 'Session date is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = gradeLifeguard(assessment.data);
		goto(`/lifeguard-certification-checklist/lifeguard-certification-checklists/${id}/report`);
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
			{isNew ? 'New lifeguard certification checklist' : `Lifeguard checklist ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Record the ten sections; the Pass / Needs Development / Fail outcome is computed on submit.
		</p>
		<Progress label="Checklist sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Checklist sections" current={TOTAL_STEPS}>
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

	<Form label="Lifeguard certification checklist" onsubmit={submit}>
		<Step1CandidateDetails />
		<Step2PhysicalFitnessSwim />
		<Step3SupervisionScanningZoning />
		<Step4RescueConscious />
		<Step5RescueUnconscious />
		<Step6SpinalInjuryManagement />
		<Step7CPRAED />
		<Step8FirstAidOxygenTherapy />
		<Step9LegalRegulatoryIncident />
		<Step10OverallResultSignoff />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute result &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
