<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { application } from '$lib/stores/application.svelte';
	import { evaluateFp92a } from '$lib/engine/fp92a-validator';
	import { isFilled, looksLikeNhsNumber } from '$lib/engine/utils';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleApplications } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Practitioner from '$lib/components/steps/Step1Practitioner.svelte';
	import Step2Patient from '$lib/components/steps/Step2Patient.svelte';
	import Step3ExistingExemption from '$lib/components/steps/Step3ExistingExemption.svelte';
	import Step4AgeCheck from '$lib/components/steps/Step4AgeCheck.svelte';
	import Step5PregnancyCheck from '$lib/components/steps/Step5PregnancyCheck.svelte';
	import Step6ConditionSelection from '$lib/components/steps/Step6ConditionSelection.svelte';
	import Step7ConditionDetail from '$lib/components/steps/Step7ConditionDetail.svelte';
	import Step8DisabilityAppliance from '$lib/components/steps/Step8DisabilityAppliance.svelte';
	import Step9Declaration from '$lib/components/steps/Step9Declaration.svelte';

	const plural = 'united-kingdom-nhs-england-medical-exemption-certificates';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample application (existing id) or a
	// blank draft (new).
	$effect(() => {
		const seed = sampleApplications.find((s) => s.id === id)?.data;
		if (application.id !== id) {
			application.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = application.data;
		const found: { id: string; message: string }[] = [];
		if (!isFilled(d.practitioner.name)) {
			found.push({ id: 'practitionerName', message: "Practitioner's full name is required." });
		}
		if (!isFilled(d.patient.surname)) {
			found.push({ id: 'patientSurname', message: 'Patient surname is required.' });
		}
		if (!isFilled(d.patient.forenames)) {
			found.push({ id: 'patientForenames', message: 'Patient forenames are required.' });
		}
		if (!isFilled(d.patient.birthDate)) {
			found.push({ id: 'patientBirthDate', message: 'Patient date of birth is required.' });
		}
		if (!looksLikeNhsNumber(d.patient.unitedKingdomNhsNumber)) {
			found.push({ id: 'nhsNumber', message: 'A 10-digit NHS number is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		application.result = evaluateFp92a(application.data);
		goto(`/united-kingdom-nhs-england-medical-exemption-certificate/${plural}/${id}/report`);
	}

	function startOver() {
		const seed = sampleApplications.find((s) => s.id === id)?.data;
		application.reset();
		application.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-16 px-4 py-6">
	<h1 class="text-2xl font-bold text-base-content">
		{isNew ? 'New FP92A application' : `FP92A application ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the nine sections; the eligibility outcome, fired rules, and advisory flags are
		computed on submit. NHSBSA accepts only the original paper form signed in ink.
	</p>
	<Progress label="Application sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Application sections" current={TOTAL_STEPS}>
		{#each steps.filter((s) => s.number < TOTAL_STEPS) as step (step.number)}
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

	<Form label="FP92A application" onsubmit={submit}>
		<Step1Practitioner />
		<Step2Patient />
		<Step3ExistingExemption />
		<Step4AgeCheck />
		<Step5PregnancyCheck />
		<Step6ConditionSelection />
		<Step7ConditionDetail />
		<Step8DisabilityAppliance />
		<Step9Declaration />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Evaluate eligibility &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
