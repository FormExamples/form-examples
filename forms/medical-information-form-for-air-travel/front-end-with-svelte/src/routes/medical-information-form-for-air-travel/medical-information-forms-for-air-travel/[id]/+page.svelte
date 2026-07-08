<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { store } from '$lib/stores/assessment.svelte';
	import { evaluateFitnessToFly } from '$lib/engine/composite-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step01Submitter from '$lib/components/steps/Step01Submitter.svelte';
	import Step02Passenger from '$lib/components/steps/Step02Passenger.svelte';
	import Step03Trip from '$lib/components/steps/Step03Trip.svelte';
	import Step04Reasons from '$lib/components/steps/Step04Reasons.svelte';
	import Step05Physician from '$lib/components/steps/Step05Physician.svelte';
	import Step06Diagnosis from '$lib/components/steps/Step06Diagnosis.svelte';
	import Step07Cardiovascular from '$lib/components/steps/Step07Cardiovascular.svelte';
	import Step08Respiratory from '$lib/components/steps/Step08Respiratory.svelte';
	import Step09RecentEvents from '$lib/components/steps/Step09RecentEvents.svelte';
	import Step10Pregnancy from '$lib/components/steps/Step10Pregnancy.svelte';
	import Step11Communicable from '$lib/components/steps/Step11Communicable.svelte';
	import Step12InflightNeeds from '$lib/components/steps/Step12InflightNeeds.svelte';
	import Step13CabinMeds from '$lib/components/steps/Step13CabinMeds.svelte';
	import Step14Summary from '$lib/components/steps/Step14Summary.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample MEDIF (existing id) or a
	// blank draft (new).
	$effect(() => {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
		if (store.id !== id) {
			store.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = store.data;
		const found: { id: string; message: string }[] = [];
		if (d.passenger.lastName.trim() === '') {
			found.push({ id: 'passengerLastName', message: 'Passenger last name is required.' });
		}
		if (d.passenger.dateOfBirth === '') {
			found.push({ id: 'passengerDateOfBirth', message: 'Passenger date of birth is required.' });
		}
		if (d.physician.physicianName.trim() === '') {
			found.push({ id: 'physicianName', message: 'Attending physician name is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		store.result = evaluateFitnessToFly(store.data);
		goto(`/medical-information-form-for-air-travel/medical-information-forms-for-air-travel/${id}/report`);
	}

	function startOver() {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
		store.reset();
		store.loadForId(id, seed);
		errors = [];
	}

	const stepComponents = [
		Step01Submitter,
		Step02Passenger,
		Step03Trip,
		Step04Reasons,
		Step05Physician,
		Step06Diagnosis,
		Step07Cardiovascular,
		Step08Respiratory,
		Step09RecentEvents,
		Step10Pregnancy,
		Step11Communicable,
		Step12InflightNeeds,
		Step13CabinMeds,
		Step14Summary
	];
</script>

<main class="mx-auto max-w-3xl px-4 py-6">
	<header class="mb-6 no-print">
		<h1 class="text-2xl font-bold text-base-content">
			{isNew ? 'New MEDIF' : `MEDIF ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the fourteen sections; the fitness-to-fly band, fired rules, and safety flags are
			computed on submit.
		</p>
		<Progress label="MEDIF sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="MEDIF sections" current={TOTAL_STEPS}>
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

	<Form label="Medical Information Form for Air Travel" onsubmit={submit}>
		<div class="space-y-8">
			{#each stepComponents as StepComponent, i (i)}
				<div id="step-{i + 1}" class="rounded-lg border border-base-300 bg-base-100 p-6 shadow-sm scroll-mt-20">
					<StepComponent />
				</div>
			{/each}
		</div>

		<div class="button-group mt-8">
			<Button type="submit" data-variant="primary">Compute band &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
