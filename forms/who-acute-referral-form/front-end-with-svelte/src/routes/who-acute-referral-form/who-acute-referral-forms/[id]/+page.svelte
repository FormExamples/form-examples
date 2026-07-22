<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateReferral } from '$lib/engine/referral-validator';
	import { detectFlaggedIssues } from '$lib/engine/flagged-issues';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1PatientIdentification from '$lib/components/steps/Step1PatientIdentification.svelte';
	import Step2FacilityAndTransport from '$lib/components/steps/Step2FacilityAndTransport.svelte';
	import Step3Situation from '$lib/components/steps/Step3Situation.svelte';
	import Step4Background from '$lib/components/steps/Step4Background.svelte';
	import Step5Assessment from '$lib/components/steps/Step5Assessment.svelte';
	import Step6Recommendations from '$lib/components/steps/Step6Recommendations.svelte';
	import Step7ProviderSignoff from '$lib/components/steps/Step7ProviderSignoff.svelte';
	import Step8ReferralFacilityReceipt from '$lib/components/steps/Step8ReferralFacilityReceipt.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample referral (existing id) or a
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
		if (d.patientIdentification.patientLastName.trim() === '') {
			found.push({ id: 'patientLastName', message: 'Patient last name is required.' });
		}
		if (d.patientIdentification.patientFirstName.trim() === '') {
			found.push({ id: 'patientFirstName', message: 'Patient first name is required.' });
		}
		if (d.patientIdentification.dateOfBirth === '') {
			found.push({ id: 'dateOfBirth', message: 'Patient date of birth is required.' });
		}
		if (d.situation.chiefComplaint.trim() === '') {
			found.push({ id: 'chiefComplaint', message: 'Chief complaint is required.' });
		}
		if (d.situation.primaryDiagnosis.trim() === '') {
			found.push({ id: 'primaryDiagnosis', message: 'Primary diagnosis is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.validation = validateReferral(assessment.data);
		assessment.flags = detectFlaggedIssues(assessment.data);
		goto(`/who-acute-referral-form/who-acute-referral-forms/${id}/report`);
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
		{isNew ? 'New acute referral' : `Acute referral ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the eight sections using the SBAR framework; the completeness summary and flagged
		issues are computed on submit.
	</p>
	<Progress label="Referral sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Referral sections" current={TOTAL_STEPS}>
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

	<Form label="WHO acute referral form" onsubmit={submit}>
		<Step1PatientIdentification />
		<Step2FacilityAndTransport />
		<Step3Situation />
		<Step4Background />
		<Step5Assessment />
		<Step6Recommendations />
		<Step7ProviderSignoff />
		<Step8ReferralFacilityReceipt />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Check &amp; view report</Button>
			<Button type="button" data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
