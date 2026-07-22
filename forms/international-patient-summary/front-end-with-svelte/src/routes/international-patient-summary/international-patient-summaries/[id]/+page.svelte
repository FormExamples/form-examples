<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateIPSGrade } from '$lib/engine/ips-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1PatientDemographics from '$lib/components/steps/Step1PatientDemographics.svelte';
	import Step2ProblemList from '$lib/components/steps/Step2ProblemList.svelte';
	import Step3MedicationSummary from '$lib/components/steps/Step3MedicationSummary.svelte';
	import Step4AllergiesIntolerances from '$lib/components/steps/Step4AllergiesIntolerances.svelte';
	import Step5Immunisations from '$lib/components/steps/Step5Immunisations.svelte';
	import Step6Procedures from '$lib/components/steps/Step6Procedures.svelte';
	import Step7ResultsInvestigations from '$lib/components/steps/Step7ResultsInvestigations.svelte';
	import Step8MedicalDevicesImplants from '$lib/components/steps/Step8MedicalDevicesImplants.svelte';
	import Step9AdvanceDirectivesConsent from '$lib/components/steps/Step9AdvanceDirectivesConsent.svelte';
	import Step10AuthoringClinicianSignoff from '$lib/components/steps/Step10AuthoringClinicianSignoff.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample IPS (existing id) or a blank
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
		if (d.patientDemographics.givenName.trim() === '') {
			found.push({ id: 'givenName', message: 'Patient given name is required.' });
		}
		if (d.patientDemographics.familyName.trim() === '') {
			found.push({ id: 'familyName', message: 'Patient family name is required.' });
		}
		if (d.patientDemographics.dateOfBirth === '') {
			found.push({ id: 'dateOfBirth', message: 'Date of birth is required.' });
		}
		if (d.authoringClinician.clinicianName.trim() === '') {
			found.push({ id: 'clinicianName', message: 'Authoring clinician name is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateIPSGrade(assessment.data);
		goto(`/international-patient-summary/international-patient-summaries/${id}/report`);
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
		{isNew ? 'New International Patient Summary' : `International Patient Summary ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the ten sections; the completeness level and per-section audit are computed on submit.
	</p>
	<Progress label="IPS sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="IPS sections" current={TOTAL_STEPS}>
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

	<Form label="International Patient Summary" onsubmit={submit}>
		<Step1PatientDemographics />
		<Step2ProblemList />
		<Step3MedicationSummary />
		<Step4AllergiesIntolerances />
		<Step5Immunisations />
		<Step6Procedures />
		<Step7ResultsInvestigations />
		<Step8MedicalDevicesImplants />
		<Step9AdvanceDirectivesConsent />
		<Step10AuthoringClinicianSignoff />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Validate &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
