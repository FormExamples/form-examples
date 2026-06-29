<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateRiskLevel } from '$lib/engine/intake-grader';
	import { detectAdditionalFlags } from '$lib/engine/flagged-issues';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1PersonalInformation from '$lib/components/steps/Step1PersonalInformation.svelte';
	import Step2InsuranceAndId from '$lib/components/steps/Step2InsuranceAndId.svelte';
	import Step3ReasonForVisit from '$lib/components/steps/Step3ReasonForVisit.svelte';
	import Step4MedicalHistory from '$lib/components/steps/Step4MedicalHistory.svelte';
	import Step5Medications from '$lib/components/steps/Step5Medications.svelte';
	import Step6Allergies from '$lib/components/steps/Step6Allergies.svelte';
	import Step7FamilyHistory from '$lib/components/steps/Step7FamilyHistory.svelte';
	import Step8SocialHistory from '$lib/components/steps/Step8SocialHistory.svelte';
	import Step9ReviewOfSystems from '$lib/components/steps/Step9ReviewOfSystems.svelte';
	import Step10ConsentAndPreferences from '$lib/components/steps/Step10ConsentAndPreferences.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample intake (existing id) or a
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
		if (d.personalInformation.fullName.trim() === '') {
			found.push({ id: 'fullName', message: 'Patient full name is required.' });
		}
		if (d.personalInformation.dateOfBirth === '') {
			found.push({ id: 'dob', message: 'Date of birth is required.' });
		}
		if (d.reasonForVisit.primaryReason.trim() === '') {
			found.push({ id: 'primaryReason', message: 'Reason for visit is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		const { riskLevel, firedRules } = calculateRiskLevel(assessment.data);
		const additionalFlags = detectAdditionalFlags(assessment.data);
		assessment.result = {
			riskLevel,
			firedRules,
			additionalFlags,
			timestamp: new Date().toISOString()
		};
		goto(`/patient-intakes/${id}/report`);
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
			{isNew ? 'New patient intake' : `Patient intake ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the ten sections; the risk level and flagged issues are computed on submit.
		</p>
		<Progress label="Intake sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Intake sections" current={TOTAL_STEPS}>
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

	<Form label="Patient intake" onsubmit={submit}>
		<Step1PersonalInformation />
		<Step2InsuranceAndId />
		<Step3ReasonForVisit />
		<Step4MedicalHistory />
		<Step5Medications />
		<Step6Allergies />
		<Step7FamilyHistory />
		<Step8SocialHistory />
		<Step9ReviewOfSystems />
		<Step10ConsentAndPreferences />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Classify &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
