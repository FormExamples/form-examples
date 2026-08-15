<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeDischarge } from '#lib/engine/discharge-validator.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1PatientDetails from '#lib/components/steps/Step1PatientDetails.svelte';
	import Step2AdmissionSummary from '#lib/components/steps/Step2AdmissionSummary.svelte';
	import Step3Diagnoses from '#lib/components/steps/Step3Diagnoses.svelte';
	import Step4ProceduresPerformed from '#lib/components/steps/Step4ProceduresPerformed.svelte';
	import Step5DischargeMedications from '#lib/components/steps/Step5DischargeMedications.svelte';
	import Step6FollowupArrangements from '#lib/components/steps/Step6FollowupArrangements.svelte';
	import Step7CommunityCareInstructions from '#lib/components/steps/Step7CommunityCareInstructions.svelte';
	import Step8WarningSigns from '#lib/components/steps/Step8WarningSigns.svelte';
	import Step9ClinicianSignoff from '#lib/components/steps/Step9ClinicianSignoff.svelte';
	import Step10PatientAcknowledgement from '#lib/components/steps/Step10PatientAcknowledgement.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample summary (existing id) or a
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
		if (d.patientDetails.lastName.trim() === '') {
			found.push({ id: 'lastName', message: 'Patient last name is required.' });
		}
		if (d.patientDetails.dateOfBirth === '') {
			found.push({ id: 'dob', message: 'Date of birth is required.' });
		}
		if (d.clinicianSignoff.clinicianName.trim() === '') {
			found.push({ id: 'clinicianName', message: 'Signing clinician name is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = gradeDischarge(assessment.data);
		goto(`/hospital-discharge/hospital-discharges/${id}/report`);
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
		{isNew ? 'New hospital discharge summary' : `Hospital discharge ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the ten sections; the NICE NG27 completeness level and safety flags are computed on
		submit.
	</p>
	<Progress label="Discharge sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Discharge sections" current={TOTAL_STEPS}>
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

	<Form label="Hospital discharge summary" onsubmit={submit}>
		<Step1PatientDetails />
		<Step2AdmissionSummary />
		<Step3Diagnoses />
		<Step4ProceduresPerformed />
		<Step5DischargeMedications />
		<Step6FollowupArrangements />
		<Step7CommunityCareInstructions />
		<Step8WarningSigns />
		<Step9ClinicianSignoff />
		<Step10PatientAcknowledgement />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Check completeness &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
