<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateFMS } from '$lib/engine/fms-grader';
	import { detectAdditionalFlags } from '$lib/engine/flagged-issues';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2ReferralInformation from '$lib/components/steps/Step2ReferralInformation.svelte';
	import Step3MovementHistory from '$lib/components/steps/Step3MovementHistory.svelte';
	import Step4DeepSquat from '$lib/components/steps/Step4DeepSquat.svelte';
	import Step5HurdleStep from '$lib/components/steps/Step5HurdleStep.svelte';
	import Step6InLineLunge from '$lib/components/steps/Step6InLineLunge.svelte';
	import Step7ShoulderMobility from '$lib/components/steps/Step7ShoulderMobility.svelte';
	import Step8ActiveStraightLegRaise from '$lib/components/steps/Step8ActiveStraightLegRaise.svelte';
	import Step9TrunkStabilityPushUp from '$lib/components/steps/Step9TrunkStabilityPushUp.svelte';
	import Step10RotaryStability from '$lib/components/steps/Step10RotaryStability.svelte';

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
		if (d.demographics.lastName.trim() === '') {
			found.push({ id: 'lastName', message: 'Patient last name is required.' });
		}
		if (d.demographics.dateOfBirth === '') {
			found.push({ id: 'dob', message: 'Date of birth is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		const { fmsScore, fmsCategoryLabel, firedRules } = calculateFMS(assessment.data);
		assessment.result = {
			fmsScore,
			fmsCategory: fmsCategoryLabel,
			firedRules,
			additionalFlags: detectAdditionalFlags(assessment.data),
			timestamp: new Date().toISOString()
		};
		goto(`/kinesiology-assessment/kinesiology-assessments/${id}/report`);
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
			{isNew ? 'New kinesiology assessment' : `Kinesiology assessment ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the ten sections; the composite FMS score and category are computed on submit.
		</p>
		<Progress label="Assessment sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Assessment sections" current={TOTAL_STEPS}>
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

	<Form label="Kinesiology assessment" onsubmit={submit}>
		<Step1Demographics />
		<Step2ReferralInformation />
		<Step3MovementHistory />
		<Step4DeepSquat />
		<Step5HurdleStep />
		<Step6InLineLunge />
		<Step7ShoulderMobility />
		<Step8ActiveStraightLegRaise />
		<Step9TrunkStabilityPushUp />
		<Step10RotaryStability />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute score &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
