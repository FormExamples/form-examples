<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateGrade } from '$lib/engine/anaesthetic-record-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1CaseIdentification from '$lib/components/steps/Step1CaseIdentification.svelte';
	import Step2PreInductionChecks from '$lib/components/steps/Step2PreInductionChecks.svelte';
	import Step3AsaAirwayAssessment from '$lib/components/steps/Step3AsaAirwayAssessment.svelte';
	import Step4DrugsAndDoses from '$lib/components/steps/Step4DrugsAndDoses.svelte';
	import Step5AirwayManagement from '$lib/components/steps/Step5AirwayManagement.svelte';
	import Step6Monitoring from '$lib/components/steps/Step6Monitoring.svelte';
	import Step7TimedObservations from '$lib/components/steps/Step7TimedObservations.svelte';
	import Step8FluidsAndBloodLoss from '$lib/components/steps/Step8FluidsAndBloodLoss.svelte';
	import Step9RegionalNeuraxial from '$lib/components/steps/Step9RegionalNeuraxial.svelte';
	import Step10EventsAndComplications from '$lib/components/steps/Step10EventsAndComplications.svelte';
	import Step11RecoveryHandover from '$lib/components/steps/Step11RecoveryHandover.svelte';
	import Step12SummaryAndSignOff from '$lib/components/steps/Step12SummaryAndSignOff.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample record (existing id) or a
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
		if (d.identification.patientIdentifier.trim() === '') {
			found.push({
				id: 'identification-patientIdentifier',
				message: 'Patient identifier is required.'
			});
		}
		if (d.identification.anaesthetistName.trim() === '') {
			found.push({
				id: 'identification-anaesthetistName',
				message: 'Responsible anaesthetist is required.'
			});
		}
		if (d.identification.anaestheticTechnique === '') {
			found.push({
				id: 'identification-anaestheticTechnique',
				message: 'Anaesthetic technique is required.'
			});
		}
		if (d.asaAirway.asaStatus === '') {
			found.push({ id: 'asaAirway-asaStatus', message: 'ASA physical status is required.' });
		}
		if (d.airway.airwayTechnique === '') {
			found.push({
				id: 'airway-airwayTechnique',
				message: 'Airway-management technique is required.'
			});
		}
		if (d.signoff.anaesthetistSignature.trim() === '') {
			found.push({
				id: 'signoff-anaesthetistSignature',
				message: 'Anaesthetist signature is required.'
			});
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateGrade(assessment.data);
		goto(`/anaesthetic-record/anaesthetic-records/${id}/report`);
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
		{isNew ? 'New anaesthetic record' : `Anaesthetic record ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the twelve sections; the completeness status and safety flags are computed on submit.
	</p>
	<Progress label="Record sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Record sections" current={TOTAL_STEPS}>
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

	<Form label="Anaesthetic record" onsubmit={submit}>
		<Step1CaseIdentification />
		<Step2PreInductionChecks />
		<Step3AsaAirwayAssessment />
		<Step4DrugsAndDoses />
		<Step5AirwayManagement />
		<Step6Monitoring />
		<Step7TimedObservations />
		<Step8FluidsAndBloodLoss />
		<Step9RegionalNeuraxial />
		<Step10EventsAndComplications />
		<Step11RecoveryHandover />
		<Step12SummaryAndSignOff />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Submit &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
