<script lang="ts">
	import { goto } from '$app/navigation';
	import { resultStore } from '$lib/stores/result.svelte';
	import { calculateGrade } from '$lib/engine/grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1ReportIdentification from '$lib/components/steps/Step1ReportIdentification.svelte';
	import Step2RecordingQuality from '$lib/components/steps/Step2RecordingQuality.svelte';
	import Step3ClinicalHistory from '$lib/components/steps/Step3ClinicalHistory.svelte';
	import Step4RhythmRateSummary from '$lib/components/steps/Step4RhythmRateSummary.svelte';
	import Step5StructuredFindings from '$lib/components/steps/Step5StructuredFindings.svelte';
	import Step6Impression from '$lib/components/steps/Step6Impression.svelte';
	import Step7InterpretationSignOff from '$lib/components/steps/Step7InterpretationSignOff.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	function validate(): boolean {
		const d = resultStore.data;
		const found: { id: string; message: string }[] = [];
		if (d.reportingClinician.trim() === '') {
			found.push({ id: 'reportingClinician', message: 'Reporting clinician is required.' });
		}
		if (d.reportStatus === '') {
			found.push({ id: 'reportStatus', message: 'Report status is required.' });
		}
		if (d.monitorType === '') {
			found.push({ id: 'monitorType', message: 'Monitor type is required.' });
		}
		if (d.impression.trim() === '') {
			found.push({ id: 'impression', message: 'Impression is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		resultStore.result = calculateGrade(resultStore.data);
		goto('/holter-monitor-test-result/report/view');
	}

	function startOver() {
		resultStore.reset();
		errors = [];
	}
</script>

<main class="mx-16 px-4 py-6">
	<h1 class="text-2xl font-bold text-gray-900">New Holter monitor report</h1>
	<p class="mt-1 text-sm text-gray-600">
		Complete the seven sections; the four-axis interpretation grade is computed on submit.
	</p>
	<Progress label="Report sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Report sections" current={TOTAL_STEPS}>
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

	<Form label="Holter monitor test result" onsubmit={submit}>
		<Step1ReportIdentification />
		<Step2RecordingQuality />
		<Step3ClinicalHistory />
		<Step4RhythmRateSummary />
		<Step5StructuredFindings />
		<Step6Impression />
		<Step7InterpretationSignOff />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
