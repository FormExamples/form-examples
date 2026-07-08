<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeReconciliation } from '$lib/engine/medication-reconciliation-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleReconciliations } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Encounter from '$lib/components/steps/Step1Encounter.svelte';
	import Step2Identification from '$lib/components/steps/Step2Identification.svelte';
	import Step3InformationSources from '$lib/components/steps/Step3InformationSources.svelte';
	import Step4Allergies from '$lib/components/steps/Step4Allergies.svelte';
	import Step5MedicationLineItems from '$lib/components/steps/Step5MedicationLineItems.svelte';
	import Step6Reconciliation from '$lib/components/steps/Step6Reconciliation.svelte';
	import Step7Summary from '$lib/components/steps/Step7Summary.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample reconciliation (existing id)
	// or a blank draft (new).
	$effect(() => {
		const seed = sampleReconciliations.find((s) => s.id === id)?.data;
		if (assessment.id !== id) {
			assessment.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = assessment.data;
		const found: { id: string; message: string }[] = [];
		if (d.encounter.reconciliationType === '') {
			found.push({
				id: 'encounter-reconciliationType',
				message: 'Reconciliation type is required.'
			});
		}
		if (d.encounter.careSetting === '') {
			found.push({ id: 'encounter-careSetting', message: 'Care setting is required.' });
		}
		if (d.encounter.clinicianName.trim() === '') {
			found.push({
				id: 'encounter-clinicianName',
				message: 'Reconciling clinician name is required.'
			});
		}
		if (d.identification.patientIdentifier.trim() === '') {
			found.push({
				id: 'identification-patientIdentifier',
				message: 'Patient identifier is required.'
			});
		}
		if (d.allergyReview.allergyStatus === '') {
			found.push({ id: 'allergyReview-allergyStatus', message: 'Allergy status is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = gradeReconciliation(assessment.data);
		goto(`/medication-reconciliation/medication-reconciliations/${id}/report`);
	}

	function startOver() {
		const seed = sampleReconciliations.find((s) => s.id === id)?.data;
		assessment.reset();
		assessment.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-auto max-w-3xl px-4 py-6">
	<header class="mb-6 no-print">
		<h1 class="text-2xl font-bold text-base-content">
			{isNew ? 'New medication reconciliation' : `Medication reconciliation ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the seven sections; the reconciliation status, counts, and safety flags are computed
			on submit.
		</p>
		<Progress label="Reconciliation sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Reconciliation sections" current={TOTAL_STEPS}>
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

	<Form label="Medication reconciliation" onsubmit={submit}>
		<Step1Encounter />
		<Step2Identification />
		<Step3InformationSources />
		<Step4Allergies />
		<Step5MedicationLineItems />
		<Step6Reconciliation />
		<Step7Summary />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Reconcile &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
