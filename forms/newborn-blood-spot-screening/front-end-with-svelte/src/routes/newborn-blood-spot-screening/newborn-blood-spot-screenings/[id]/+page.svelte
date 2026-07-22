<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeBloodspot } from '$lib/engine/bloodspot-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1SampleTaker from '$lib/components/steps/Step1SampleTaker.svelte';
	import Step2Identification from '$lib/components/steps/Step2Identification.svelte';
	import Step3Consent from '$lib/components/steps/Step3Consent.svelte';
	import Step4SampleEvent from '$lib/components/steps/Step4SampleEvent.svelte';
	import Step5Quality from '$lib/components/steps/Step5Quality.svelte';
	import Step6Conditions from '$lib/components/steps/Step6Conditions.svelte';
	import Step7Summary from '$lib/components/steps/Step7Summary.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample screening (existing id) or a
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
		if (d.sampleTaker.sampleTakerName.trim() === '') {
			found.push({
				id: 'sampleTaker-sampleTakerName',
				message: 'Sample-taker name is required.'
			});
		}
		if (d.sampleTaker.sampleTakerRole === '') {
			found.push({ id: 'sampleTaker-sampleTakerRole', message: 'Sample-taker role is required.' });
		}
		if (d.babyId.nhsNumber.trim() === '') {
			found.push({ id: 'babyId-nhsNumber', message: 'NHS number is required.' });
		}
		if (d.babyId.dateOfBirth === '') {
			found.push({ id: 'babyId-dateOfBirth', message: 'Date of birth is required.' });
		}
		if (d.babyId.sex === '') {
			found.push({ id: 'babyId-sex', message: 'Sex is required.' });
		}
		if (d.eligibility.consentGiven === '') {
			found.push({ id: 'eligibility-consentGiven', message: 'Consent is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = gradeBloodspot(assessment.data);
		goto(`/newborn-blood-spot-screening/newborn-blood-spot-screenings/${id}/report`);
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
		{isNew ? 'New blood spot screening' : `Blood spot screening ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the seven sections; the screening outcome is computed on submit. This is a
		classification form — there is no numeric score.
	</p>
	<Progress label="Screening sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Screening sections" current={TOTAL_STEPS}>
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

	<Form label="Blood spot screening" onsubmit={submit}>
		<Step1SampleTaker />
		<Step2Identification />
		<Step3Consent />
		<Step4SampleEvent />
		<Step5Quality />
		<Step6Conditions />
		<Step7Summary />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Classify &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
