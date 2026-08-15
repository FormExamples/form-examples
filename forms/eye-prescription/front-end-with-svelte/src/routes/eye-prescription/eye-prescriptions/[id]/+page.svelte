<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step01Prescriber from '#lib/components/steps/Step01Prescriber.svelte';
	import Step02Patient from '#lib/components/steps/Step02Patient.svelte';
	import Step03Examination from '#lib/components/steps/Step03Examination.svelte';
	import Step04VisualAcuity from '#lib/components/steps/Step04VisualAcuity.svelte';
	import Step05RightEye from '#lib/components/steps/Step05RightEye.svelte';
	import Step06LeftEye from '#lib/components/steps/Step06LeftEye.svelte';
	import Step07Addition from '#lib/components/steps/Step07Addition.svelte';
	import Step08PupillaryDistance from '#lib/components/steps/Step08PupillaryDistance.svelte';
	import Step09LensRecommendation from '#lib/components/steps/Step09LensRecommendation.svelte';
	import Step10OcularHealth from '#lib/components/steps/Step10OcularHealth.svelte';
	import Step11Summary from '#lib/components/steps/Step11Summary.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample prescription (existing id) or
	// a blank draft (new).
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
		if (d.prescriber.name.trim() === '') {
			found.push({ id: 'prescriberName', message: 'Prescriber name is required.' });
		}
		if (d.prescriber.gocRegistrationNumber.trim() === '') {
			found.push({ id: 'gocRegistrationNumber', message: 'GOC registration number is required.' });
		}
		if (d.patient.name.trim() === '') {
			found.push({ id: 'patientName', message: 'Patient name is required.' });
		}
		if (d.patient.birthDate === '') {
			found.push({ id: 'patientBirthDate', message: 'Patient date of birth is required.' });
		}
		if (d.examination.examinationDate === '') {
			found.push({ id: 'examinationDate', message: 'Examination date is required.' });
		}
		if (d.examination.issueDate === '') {
			found.push({ id: 'issueDate', message: 'Issue date is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		goto(`/eye-prescription/eye-prescriptions/${id}/report`);
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
		{isNew ? 'New eye prescription' : `Eye prescription ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the eleven sections; the refractive classification, complexity grade, and safety flags
		are computed live and finalised on submit.
	</p>
	<Progress label="Prescription sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Prescription sections" current={TOTAL_STEPS}>
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

	<Form label="Eye prescription" onsubmit={submit}>
		<Step01Prescriber />
		<Step02Patient />
		<Step03Examination />
		<Step04VisualAcuity />
		<Step05RightEye />
		<Step06LeftEye />
		<Step07Addition />
		<Step08PupillaryDistance />
		<Step09LensRecommendation />
		<Step10OcularHealth />
		<Step11Summary />

		<div class="button-group">
			<Button type="submit" data-variant="primary">View prescription report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
