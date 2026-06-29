<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateDonorGrade } from '$lib/engine/donor-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1DonorDemographics from '$lib/components/steps/Step1DonorDemographics.svelte';
	import Step2GeneralHealthWellbeing from '$lib/components/steps/Step2GeneralHealthWellbeing.svelte';
	import Step3MedicalHistory from '$lib/components/steps/Step3MedicalHistory.svelte';
	import Step4RecentIllnessInfections from '$lib/components/steps/Step4RecentIllnessInfections.svelte';
	import Step5TravelHistory from '$lib/components/steps/Step5TravelHistory.svelte';
	import Step6LifestyleRiskBehaviours from '$lib/components/steps/Step6LifestyleRiskBehaviours.svelte';
	import Step7PregnancyTransfusionHistory from '$lib/components/steps/Step7PregnancyTransfusionHistory.svelte';
	import Step8VitalSigns from '$lib/components/steps/Step8VitalSigns.svelte';
	import Step9InformedConsent from '$lib/components/steps/Step9InformedConsent.svelte';
	import Step10DonationPlan from '$lib/components/steps/Step10DonationPlan.svelte';

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
		if (d.donorDemographics.lastName.trim() === '') {
			found.push({ id: 'lastName', message: 'Donor last name is required.' });
		}
		if (d.donorDemographics.dateOfBirth === '') {
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
		assessment.result = calculateDonorGrade(assessment.data);
		goto(`/blood-donation-assessments/${id}/report`);
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
			{isNew ? 'New blood donation assessment' : `Blood donation assessment ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the ten sections; the eligibility status and deferral window are computed on submit.
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

	<Form label="Blood donation assessment" onsubmit={submit}>
		<Step1DonorDemographics />
		<Step2GeneralHealthWellbeing />
		<Step3MedicalHistory />
		<Step4RecentIllnessInfections />
		<Step5TravelHistory />
		<Step6LifestyleRiskBehaviours />
		<Step7PregnancyTransfusionHistory />
		<Step8VitalSigns />
		<Step9InformedConsent />
		<Step10DonationPlan />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Screen eligibility &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
