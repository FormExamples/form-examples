<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeForm } from '$lib/engine/grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1PatientInformation from '$lib/components/steps/Step1PatientInformation.svelte';
	import Step2AuthorizedRecipient from '$lib/components/steps/Step2AuthorizedRecipient.svelte';
	import Step3RecordsToRelease from '$lib/components/steps/Step3RecordsToRelease.svelte';
	import Step4PurposeOfRelease from '$lib/components/steps/Step4PurposeOfRelease.svelte';
	import Step5AuthorizationPeriod from '$lib/components/steps/Step5AuthorizationPeriod.svelte';
	import Step6RestrictionsLimitations from '$lib/components/steps/Step6RestrictionsLimitations.svelte';
	import Step7PatientRights from '$lib/components/steps/Step7PatientRights.svelte';
	import Step8SignatureConsent from '$lib/components/steps/Step8SignatureConsent.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample record (existing id) or a
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
		if (d.patientInformation.lastName.trim() === '') {
			found.push({ id: 'lastName', message: 'Patient last name is required.' });
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
		assessment.result = gradeForm(assessment.data);
		goto(`/medical-records-release-permission/medical-records-release-permissions/${id}/report`);
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
		{isNew ? 'New records release authorisation' : `Records release authorisation ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the eight sections; the completeness status and flagged issues are computed on submit.
	</p>
	<Progress label="Form sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Form sections" current={TOTAL_STEPS}>
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

	<Form label="Medical Records Release Permission" onsubmit={submit}>
		<Step1PatientInformation />
		<Step2AuthorizedRecipient />
		<Step3RecordsToRelease />
		<Step4PurposeOfRelease />
		<Step5AuthorizationPeriod />
		<Step6RestrictionsLimitations />
		<Step7PatientRights />
		<Step8SignatureConsent />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Validate &amp; view summary</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
