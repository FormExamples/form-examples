<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateGrade } from '$lib/engine/cervical-screening-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Context from '$lib/components/steps/Step1Context.svelte';
	import Step2Identification from '$lib/components/steps/Step2Identification.svelte';
	import Step3Eligibility from '$lib/components/steps/Step3Eligibility.svelte';
	import Step4Consent from '$lib/components/steps/Step4Consent.svelte';
	import Step5Symptoms from '$lib/components/steps/Step5Symptoms.svelte';
	import Step6Adequacy from '$lib/components/steps/Step6Adequacy.svelte';
	import Step7Hpv from '$lib/components/steps/Step7Hpv.svelte';
	import Step8Cytology from '$lib/components/steps/Step8Cytology.svelte';
	import Step9Note from '$lib/components/steps/Step9Note.svelte';

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
		if (d.context.sampleTakerName.trim() === '') {
			found.push({ id: 'context-sampleTakerName', message: 'Sample-taker name is required.' });
		}
		if (d.context.sampleTakerRole === '') {
			found.push({ id: 'context-sampleTakerRole', message: 'Sample-taker role is required.' });
		}
		if (d.context.careSetting === '') {
			found.push({ id: 'context-careSetting', message: 'Care setting is required.' });
		}
		if (d.identification.patientIdentifier.trim() === '') {
			found.push({
				id: 'identification-patientIdentifier',
				message: 'Local patient identifier is required.'
			});
		}
		if (d.consent.consentGiven === '') {
			found.push({ id: 'consent-consentGiven', message: 'Informed consent must be recorded.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateGrade(assessment.data);
		goto(`/cervical-screenings/${id}/report`);
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
			{isNew ? 'New cervical screening' : `Cervical screening ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the nine sections; the result classification is computed on submit. This is a
			classification form — there is no numeric score.
		</p>
		<Progress label="Screening sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Screening sections" current={TOTAL_STEPS}>
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

	<Form label="Cervical screening" onsubmit={submit}>
		<Step1Context />
		<Step2Identification />
		<Step3Eligibility />
		<Step4Consent />
		<Step5Symptoms />
		<Step6Adequacy />
		<Step7Hpv />
		<Step8Cytology />
		<Step9Note />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Classify &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
