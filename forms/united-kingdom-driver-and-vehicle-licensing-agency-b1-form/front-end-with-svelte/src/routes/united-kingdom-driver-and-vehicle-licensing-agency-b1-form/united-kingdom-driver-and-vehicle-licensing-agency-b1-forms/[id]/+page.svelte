<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateB1 } from '$lib/engine/b1-validator';
	import { detectFlaggedIssues } from '$lib/engine/flagged-issues';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	import Step1PersonalDetails from '$lib/components/steps/Step1PersonalDetails.svelte';
	import Step2HealthcareProfessionals from '$lib/components/steps/Step2HealthcareProfessionals.svelte';
	import Step3ConditionHistory from '$lib/components/steps/Step3ConditionHistory.svelte';
	import Step4TreatmentProvider from '$lib/components/steps/Step4TreatmentProvider.svelte';
	import Step5Blackouts from '$lib/components/steps/Step5Blackouts.svelte';
	import Step6Seizures from '$lib/components/steps/Step6Seizures.svelte';
	import Step7Medication from '$lib/components/steps/Step7Medication.svelte';
	import Step8VpShunt from '$lib/components/steps/Step8VpShunt.svelte';
	import Step9DailyLiving from '$lib/components/steps/Step9DailyLiving.svelte';
	import Step10DoubleVision from '$lib/components/steps/Step10DoubleVision.svelte';
	import Step11Eyesight from '$lib/components/steps/Step11Eyesight.svelte';
	import Step12VehicleAdaptations from '$lib/components/steps/Step12VehicleAdaptations.svelte';
	import Step13Authorisation from '$lib/components/steps/Step13Authorisation.svelte';

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
			found.push({ id: 'fullName', message: 'Applicant full name is required.' });
		}
		if (d.personalDetails.dateOfBirth === '') {
			found.push({ id: 'dob', message: 'Date of birth is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.validation = validateB1(assessment.data);
		assessment.flags = detectFlaggedIssues(assessment.data);
		goto(`/united-kingdom-driver-and-vehicle-licensing-agency-b1-form/united-kingdom-driver-and-vehicle-licensing-agency-b1-forms/${id}/report`);
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
			{isNew ? 'New DVLA B1 form' : `DVLA B1 form ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the thirteen sections; the completeness check and flagged issues are computed on
			submit. Conditional questions appear only when they apply to your answers.
		</p>
		<Progress label="Form sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Form sections" current={TOTAL_STEPS}>
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

	<Alert type="info" class="mb-6">
		<p>
			This single-page form collects the medical information the DVLA requires to assess fitness to
			drive following a neurological condition. When you have completed the form, submit it to see a
			completeness summary and a list of flagged issues.
		</p>
	</Alert>

	<Form label="DVLA B1 form" onsubmit={submit}>
		<Step1PersonalDetails />
		<Step2HealthcareProfessionals />
		<Step3ConditionHistory />
		<Step4TreatmentProvider />
		<Step5Blackouts />
		<Step6Seizures />
		<Step7Medication />
		<Step8VpShunt />
		<Step9DailyLiving />
		<Step10DoubleVision />
		<Step11Eyesight />
		<Step12VehicleAdaptations />
		<Step13Authorisation />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Check &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
