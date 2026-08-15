<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { gradeCfar } from '#lib/engine/cfar-grader.js';
	import { steps, TOTAL_STEPS } from '#lib/config/steps.js';
	import { sampleAssessments } from '#lib/data/sample-reports.js';

	import Form from '#lib/components/ui/Form.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import Progress from '#lib/components/ui/Progress.svelte';
	import StepList from '#lib/components/ui/StepList.svelte';
	import StepListItem from '#lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '#lib/components/ui/ErrorSummary.svelte';

	import Step1PatientIdentification from '#lib/components/steps/Step1PatientIdentification.svelte';
	import Step2ReferralTransport from '#lib/components/steps/Step2ReferralTransport.svelte';
	import Step3Situation from '#lib/components/steps/Step3Situation.svelte';
	import Step4Background from '#lib/components/steps/Step4Background.svelte';
	import Step5MajorBleeding from '#lib/components/steps/Step5MajorBleeding.svelte';
	import Step6Airway from '#lib/components/steps/Step6Airway.svelte';
	import Step7Breathing from '#lib/components/steps/Step7Breathing.svelte';
	import Step8Circulation from '#lib/components/steps/Step8Circulation.svelte';
	import Step9Disability from '#lib/components/steps/Step9Disability.svelte';
	import Step10Exposure from '#lib/components/steps/Step10Exposure.svelte';
	import Step11Recommendations from '#lib/components/steps/Step11Recommendations.svelte';
	import Step12ResponderDetails from '#lib/components/steps/Step12ResponderDetails.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample encounter (existing id) or a
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
		if (d.patientIdentification.patientName.trim() === '') {
			found.push({ id: 'patientName', message: 'Patient name is required.' });
		}
		if (d.responderDetails.name.trim() === '') {
			found.push({ id: 'responderName', message: 'Community first aid responder name is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = gradeCfar(assessment.data);
		goto(`/who-emergency-first-aid-form/who-emergency-first-aid-forms/${id}/report`);
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
		{isNew ? 'New emergency first aid encounter' : `Emergency first aid encounter ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the twelve sections; completeness and flagged issues are computed on submit.
	</p>
	<Progress label="Encounter sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Encounter sections" current={TOTAL_STEPS}>
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

	<Form label="Emergency first aid encounter" onsubmit={submit}>
		<Step1PatientIdentification />
		<Step2ReferralTransport />
		<Step3Situation />
		<Step4Background />
		<Step5MajorBleeding />
		<Step6Airway />
		<Step7Breathing />
		<Step8Circulation />
		<Step9Disability />
		<Step10Exposure />
		<Step11Recommendations />
		<Step12ResponderDetails />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Check &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
