<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateValidity } from '#lib/engine/validity-grader.js';
	import { detectAdditionalFlags } from '#lib/engine/flagged-issues.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1PersonalInformation from '#lib/components/steps/Step1PersonalInformation.svelte';
	import Step2CapacityDeclaration from '#lib/components/steps/Step2CapacityDeclaration.svelte';
	import Step3Circumstances from '#lib/components/steps/Step3Circumstances.svelte';
	import Step4TreatmentsRefusedGeneral from '#lib/components/steps/Step4TreatmentsRefusedGeneral.svelte';
	import Step5TreatmentsRefusedLifeSustaining from '#lib/components/steps/Step5TreatmentsRefusedLifeSustaining.svelte';
	import Step6ExceptionsConditions from '#lib/components/steps/Step6ExceptionsConditions.svelte';
	import Step7OtherWishes from '#lib/components/steps/Step7OtherWishes.svelte';
	import Step8LastingPowerOfAttorney from '#lib/components/steps/Step8LastingPowerOfAttorney.svelte';
	import Step9HealthcareProfessionalReview from '#lib/components/steps/Step9HealthcareProfessionalReview.svelte';
	import Step10LegalSignatures from '#lib/components/steps/Step10LegalSignatures.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample ADRT (existing id) or a blank
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
		if (d.personalInformation.fullLegalName.trim() === '') {
			found.push({ id: 'fullLegalName', message: 'Full legal name is required.' });
		}
		if (d.personalInformation.dateOfBirth === '') {
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
		const { validityStatus, firedRules } = calculateValidity(assessment.data);
		assessment.result = {
			validityStatus,
			firedRules,
			additionalFlags: detectAdditionalFlags(assessment.data),
			timestamp: new Date().toISOString()
		};
		goto(`/advance-decision-to-refuse-treatment/advance-decisions-to-refuse-treatment/${id}/report`);
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
		{isNew ? 'New advance decision to refuse treatment' : `Advance decision to refuse treatment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the ten sections; the legal validity status and flagged issues are computed on submit.
	</p>
	<Progress label="ADRT sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="ADRT sections" current={TOTAL_STEPS}>
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

	<Form label="Advance decision to refuse treatment" onsubmit={submit}>
		<Step1PersonalInformation />
		<Step2CapacityDeclaration />
		<Step3Circumstances />
		<Step4TreatmentsRefusedGeneral />
		<Step5TreatmentsRefusedLifeSustaining />
		<Step6ExceptionsConditions />
		<Step7OtherWishes />
		<Step8LastingPowerOfAttorney />
		<Step9HealthcareProfessionalReview />
		<Step10LegalSignatures />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Check validity &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
