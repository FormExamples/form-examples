<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateZaritGrade } from '#lib/engine/zarit-grader.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { activeItemNumbers, normalizeInstrumentForm, ratingValue } from '#lib/engine/zarit-rules.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1Context from '#lib/components/steps/Step1Context.svelte';
	import Step2Carer from '#lib/components/steps/Step2Carer.svelte';
	import Step3Recipient from '#lib/components/steps/Step3Recipient.svelte';
	import Step4Items from '#lib/components/steps/Step4Items.svelte';
	import Step5Summary from '#lib/components/steps/Step5Summary.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample assessment (existing id) or a
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
		if (d.context.practitionerName.trim() === '') {
			found.push({
				id: 'context-practitionerName',
				message: 'Administering practitioner name is required.'
			});
		}
		if (d.context.practitionerRole === '') {
			found.push({ id: 'context-practitionerRole', message: 'Practitioner role is required.' });
		}
		if (d.context.careSetting === '') {
			found.push({ id: 'context-careSetting', message: 'Care setting is required.' });
		}
		if (d.carer.carerIdentifier.trim() === '') {
			found.push({
				id: 'carer-carerIdentifier',
				message: 'Carer identifier is required.'
			});
		}
		const instrumentForm = normalizeInstrumentForm(d);
		for (const num of activeItemNumbers(instrumentForm)) {
			const v = ratingValue(d.items[`item${num}` as keyof typeof d.items]);
			if (v === null) {
				found.push({ id: `items-item${num}`, message: `Item ${num} has not been answered.` });
			}
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateZaritGrade(assessment.data);
		goto(`/zarit-burden-interview/zarit-burden-interviews/${id}/report`);
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
		{isNew ? 'New ZBI assessment' : `ZBI assessment ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the five sections; the ZBI total and burden band are computed on submit.
	</p>
	<Progress label="Assessment sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Assessment sections" current={TOTAL_STEPS}>
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

	<Form label="ZBI assessment" onsubmit={submit}>
		<Step1Context />
		<Step2Carer />
		<Step3Recipient />
		<Step4Items />
		<Step5Summary />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute score &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
