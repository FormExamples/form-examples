<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { validateM1 } from '#lib/engine/m1-validator.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1PersonalDetails from '#lib/components/steps/Step1PersonalDetails.svelte';
	import Step2HealthcareProfessionals from '#lib/components/steps/Step2HealthcareProfessionals.svelte';
	import Step3DiagnosisConfirmation from '#lib/components/steps/Step3DiagnosisConfirmation.svelte';
	import Step4MentalHealthConditions from '#lib/components/steps/Step4MentalHealthConditions.svelte';
	import Step5RecentContact from '#lib/components/steps/Step5RecentContact.svelte';
	import Step6Authorisation from '#lib/components/steps/Step6Authorisation.svelte';

	const plural = 'united-kingdom-driver-and-vehicle-licensing-agency-m1-forms';
	const title = 'DVLA M1 — Confidential Medical Information';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample form (existing id) or a blank
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
		if (d.personalDetails.fullName.trim() === '') {
			found.push({ id: 'fullName', message: 'Full name is required.' });
		}
		if (d.personalDetails.dateOfBirth === '') {
			found.push({ id: 'dob', message: 'Date of birth is required.' });
		}
		if (d.personalDetails.postcode.trim() === '') {
			found.push({ id: 'postcode', message: 'Postcode is required.' });
		}
		if (d.diagnosisConfirmation.hasMentalHealthDiagnosis === '') {
			found.push({
				id: 'hasMentalHealthDiagnosis',
				message: 'Question 1 (mental health diagnosis) must be answered.'
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
		assessment.result = validateM1(assessment.data);
		goto(`/united-kingdom-driver-and-vehicle-licensing-agency-m1-form/${plural}/${id}/report`);
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
		{isNew ? 'New DVLA M1 form' : `DVLA M1 form ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the six sections; completeness, consistency, and clinical flags are computed on submit.
	</p>
	<Progress label="Form sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Form sections" current={TOTAL_STEPS}>
		{#each steps as step (step.number)}
			<StepListItem status="finished" label={step.title}>{step.shortTitle}</StepListItem>
		{/each}
	</StepList>

	<Alert type="info" class="mb-6 no-print">
		<p>
			This single-page form captures the information needed by the Drivers Medical Group at DVLA
			Swansea to assess your fitness to drive in relation to a mental health condition. Your responses
			are confidential and used only by the DVLA medical assessor and your healthcare professional.
		</p>
	</Alert>

	{#if errors.length > 0}
		<ErrorSummary title="Please fix the following before submitting" class="mb-6">
			<ul>
				{#each errors as e (e.id)}
					<li><a href={`#${e.id}`}>{e.message}</a></li>
				{/each}
			</ul>
		</ErrorSummary>
	{/if}

	<Form label={title} onsubmit={submit}>
		<Step1PersonalDetails />
		<Step2HealthcareProfessionals />
		<Step3DiagnosisConfirmation />
		<Step4MentalHealthConditions />
		<Step5RecentContact />
		<Step6Authorisation />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Submit &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
