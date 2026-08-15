<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { store } from '#lib/stores/fitnote.svelte.js';
	import { gradeFitNote } from '#lib/engine/grader.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleFitNotes } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1Issuer from '#lib/components/steps/Step1Issuer.svelte';
	import Step2Patient from '#lib/components/steps/Step2Patient.svelte';
	import Step3Assessment from '#lib/components/steps/Step3Assessment.svelte';
	import Step4Diagnosis from '#lib/components/steps/Step4Diagnosis.svelte';
	import Step5FitnessForWork from '#lib/components/steps/Step5FitnessForWork.svelte';
	import Step6Adaptations from '#lib/components/steps/Step6Adaptations.svelte';
	import Step7Comments from '#lib/components/steps/Step7Comments.svelte';
	import Step8Period from '#lib/components/steps/Step8Period.svelte';
	import Step9FollowUp from '#lib/components/steps/Step9FollowUp.svelte';
	import Step10SignOff from '#lib/components/steps/Step10SignOff.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample fit note (existing id) or a
	// blank draft (new).
	$effect(() => {
		const seed = sampleFitNotes.find((s) => s.id === id)?.data;
		if (store.id !== id) {
			store.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = store.data;
		const found: { id: string; message: string }[] = [];
		if (d.clinician.name.trim() === '') {
			found.push({ id: 'clinician-name', message: 'Issuer name is required (DWP policy 3.7).' });
		}
		if (d.clinician.profession === '') {
			found.push({
				id: 'clinician-profession',
				message: 'Issuer profession is required (DWP policy 3.7).'
			});
		}
		if (d.medicalPractice.postalAddressAsFullText.trim() === '') {
			found.push({
				id: 'practice-address',
				message: 'Practice address is required (DWP policy 3.7).'
			});
		}
		if (d.patient.name.trim() === '') {
			found.push({ id: 'patient-name', message: 'Patient name is required.' });
		}
		if (d.fitnessForWork === '') {
			found.push({ id: 'fitnessForWork', message: 'Fitness for work selection is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		store.result = gradeFitNote(store.data);
		goto(`/united-kingdom-statement-of-fitness-for-work/united-kingdom-statements-of-fitness-for-work/${id}/report`);
	}

	function startOver() {
		const seed = sampleFitNotes.find((s) => s.id === id)?.data;
		store.reset();
		store.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-16 px-4 py-6">
	<h1 class="text-2xl font-bold text-base-content">
		{isNew ? 'New fit note' : `Fit note ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the ten sections; the fitness category, period compliance, validity, and
		recommendation are computed on submit.
	</p>
	<Progress label="Fit-note sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Fit-note sections" current={TOTAL_STEPS}>
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

	<Form label="UK Statement of Fitness for Work" onsubmit={submit}>
		<Step1Issuer />
		<Step2Patient />
		<Step3Assessment />
		<Step4Diagnosis />
		<Step5FitnessForWork />
		<Step6Adaptations />
		<Step7Comments />
		<Step8Period />
		<Step9FollowUp />
		<Step10SignOff />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
