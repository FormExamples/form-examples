<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateV1 } from '$lib/engine/v1-validator';
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
	import Step3EyesightStandards from '$lib/components/steps/Step3EyesightStandards.svelte';
	import Step4VisionInBothEyes from '$lib/components/steps/Step4VisionInBothEyes.svelte';
	import Step5FieldOfVision from '$lib/components/steps/Step5FieldOfVision.svelte';
	import Step6Glaucoma from '$lib/components/steps/Step6Glaucoma.svelte';
	import Step7RetinitisPigmentosa from '$lib/components/steps/Step7RetinitisPigmentosa.svelte';
	import Step8LaserTreatment from '$lib/components/steps/Step8LaserTreatment.svelte';
	import Step9Blepharospasm from '$lib/components/steps/Step9Blepharospasm.svelte';
	import Step10NightBlindness from '$lib/components/steps/Step10NightBlindness.svelte';
	import Step11DoubleVision from '$lib/components/steps/Step11DoubleVision.svelte';
	import Step12OtherVisionConditions from '$lib/components/steps/Step12OtherVisionConditions.svelte';
	import Step13RecentContact from '$lib/components/steps/Step13RecentContact.svelte';
	import Step14Authorisation from '$lib/components/steps/Step14Authorisation.svelte';

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
		assessment.validation = validateV1(assessment.data);
		assessment.flags = detectFlaggedIssues(assessment.data);
		goto(`/united-kingdom-driver-and-vehicle-licensing-agency-v1-forms/${id}/report`);
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
			{isNew ? 'New DVLA V1 form' : `DVLA V1 form ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the fourteen sections; the completeness check and flagged issues are computed on
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
			This single-page form collects the vision self-declaration the DVLA requires to assess fitness
			to drive. When you have completed the form, submit it to see a completeness summary and a list
			of flagged issues.
		</p>
	</Alert>

	<Form label="DVLA V1 form" onsubmit={submit}>
		<Step1PersonalDetails />
		<Step2HealthcareProfessionals />
		<Step3EyesightStandards />
		<Step4VisionInBothEyes />
		<Step5FieldOfVision />
		<Step6Glaucoma />
		<Step7RetinitisPigmentosa />
		<Step8LaserTreatment />
		<Step9Blepharospasm />
		<Step10NightBlindness />
		<Step11DoubleVision />
		<Step12OtherVisionConditions />
		<Step13RecentContact />
		<Step14Authorisation />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Check &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
