<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateHistoryAndPhysicalGrade } from '#lib/engine/history-and-physical-grader.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1Encounter from '#lib/components/steps/Step1Encounter.svelte';
	import Step2Identification from '#lib/components/steps/Step2Identification.svelte';
	import Step3Complaint from '#lib/components/steps/Step3Complaint.svelte';
	import Step4PastHistory from '#lib/components/steps/Step4PastHistory.svelte';
	import Step5SocialSystems from '#lib/components/steps/Step5SocialSystems.svelte';
	import Step6Vitals from '#lib/components/steps/Step6Vitals.svelte';
	import Step7Examination from '#lib/components/steps/Step7Examination.svelte';
	import Step8Impression from '#lib/components/steps/Step8Impression.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample clerking (existing id) or a
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
		if (d.encounter.clinicianName.trim() === '') {
			found.push({
				id: 'encounter-clinicianName',
				message: 'Clerking clinician name is required.'
			});
		}
		if (d.encounter.clinicianRole === '') {
			found.push({ id: 'encounter-clinicianRole', message: 'Clinician role is required.' });
		}
		if (d.encounter.careSetting === '') {
			found.push({ id: 'encounter-careSetting', message: 'Care setting is required.' });
		}
		if (d.identification.patientIdentifier.trim() === '') {
			found.push({
				id: 'identification-patientIdentifier',
				message: 'Patient identifier is required.'
			});
		}
		if (d.identification.ageBand === '') {
			found.push({ id: 'identification-ageBand', message: 'Age band is required.' });
		}
		if (d.identification.sex === '') {
			found.push({ id: 'identification-sex', message: 'Sex is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateHistoryAndPhysicalGrade(assessment.data);
		goto(`/history-and-physical-examination/history-and-physical-examinations/${id}/report`);
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
		{isNew ? 'New H and P clerking' : `H and P clerking ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the eight sections; completeness is computed on submit. This is a documentation
		instrument — there is no numeric score.
	</p>
	<Progress label="Clerking sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Clerking sections" current={TOTAL_STEPS}>
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

	<Form label="H and P clerking" onsubmit={submit}>
		<Step1Encounter />
		<Step2Identification />
		<Step3Complaint />
		<Step4PastHistory />
		<Step5SocialSystems />
		<Step6Vitals />
		<Step7Examination />
		<Step8Impression />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
