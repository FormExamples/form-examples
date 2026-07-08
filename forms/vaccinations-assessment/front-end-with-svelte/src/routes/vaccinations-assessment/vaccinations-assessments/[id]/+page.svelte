<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateVaccinationStatus } from '$lib/engine/vaccination-grader';
	import { detectAdditionalFlags } from '$lib/engine/flagged-issues';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1PatientInformation from '$lib/components/steps/Step1PatientInformation.svelte';
	import Step2ImmunizationHistory from '$lib/components/steps/Step2ImmunizationHistory.svelte';
	import Step3ChildhoodVaccinations from '$lib/components/steps/Step3ChildhoodVaccinations.svelte';
	import Step4AdultVaccinations from '$lib/components/steps/Step4AdultVaccinations.svelte';
	import Step5TravelVaccinations from '$lib/components/steps/Step5TravelVaccinations.svelte';
	import Step6OccupationalVaccinations from '$lib/components/steps/Step6OccupationalVaccinations.svelte';
	import Step7ContraindicationsAllergies from '$lib/components/steps/Step7ContraindicationsAllergies.svelte';
	import Step8ConsentInformation from '$lib/components/steps/Step8ConsentInformation.svelte';
	import Step9AdministrationRecord from '$lib/components/steps/Step9AdministrationRecord.svelte';
	import Step10ClinicalReview from '$lib/components/steps/Step10ClinicalReview.svelte';

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
		if (d.patientInformation.patientName.trim() === '') {
			found.push({ id: 'patientName', message: 'Patient name is required.' });
		}
		if (d.patientInformation.dateOfBirth === '') {
			found.push({ id: 'dateOfBirth', message: 'Date of birth is required.' });
		}
		if (d.patientInformation.nhsNumber.trim() === '') {
			found.push({ id: 'nhsNumber', message: 'NHS number is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		const { level, score, firedRules } = calculateVaccinationStatus(assessment.data);
		assessment.result = {
			vaccinationLevel: level,
			vaccinationScore: score,
			firedRules,
			additionalFlags: detectAdditionalFlags(assessment.data),
			timestamp: new Date().toISOString()
		};
		goto(`/vaccinations-assessment/vaccinations-assessments/${id}/report`);
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
			{isNew ? 'New vaccinations assessment' : `Vaccinations assessment ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the ten sections; the vaccination level and completeness score are computed on submit.
		</p>
		<Progress label="Assessment sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Assessment sections" current={TOTAL_STEPS}>
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

	<Form label="Vaccinations assessment" onsubmit={submit}>
		<Step1PatientInformation />
		<Step2ImmunizationHistory />
		<Step3ChildhoodVaccinations />
		<Step4AdultVaccinations />
		<Step5TravelVaccinations />
		<Step6OccupationalVaccinations />
		<Step7ContraindicationsAllergies />
		<Step8ConsentInformation />
		<Step9AdministrationRecord />
		<Step10ClinicalReview />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
