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
	import Step2ClinicalHistoryAcquisition from '$lib/components/steps/Step2ClinicalHistoryAcquisition.svelte';
	import Step3Findings from '$lib/components/steps/Step3Findings.svelte';
	import Step4MeasurementsComparison from '$lib/components/steps/Step4MeasurementsComparison.svelte';
	import Step5ImpressionStructuredReporting from '$lib/components/steps/Step5ImpressionStructuredReporting.svelte';
	import Step6CriticalResultCommunication from '$lib/components/steps/Step6CriticalResultCommunication.svelte';
	import Step7InterpretationSignOff from '$lib/components/steps/Step7InterpretationSignOff.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	function validate(): boolean {
		const d = resultStore.data;
		const found: { id: string; message: string }[] = [];
		if (d.reportingClinician.trim() === '') {
			found.push({ id: 'reportingClinician', message: 'Reporting clinician is required.' });
		}
		if (d.scanType === '') {
			found.push({ id: 'scanType', message: 'Scan type is required.' });
		}
		if (d.reportStatus === '') {
			found.push({ id: 'reportStatus', message: 'Report status is required.' });
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
		goto('/pet-scan-test-result/report/view');
	}

	function startOver() {
		resultStore.reset();
		errors = [];
	}
</script>

<main class="mx-auto max-w-3xl px-4 py-6">
	<header class="mb-6 no-print">
		<h1 class="text-2xl font-bold text-gray-900">New PET scan report</h1>
		<p class="mt-1 text-sm text-gray-600">
			Complete the seven sections; the four-axis interpretation grade is computed on submit.
		</p>
		<Progress label="Report sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Report sections" current={TOTAL_STEPS}>
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

	<Form label="PET scan test result" onsubmit={submit}>
		<Step1ReportIdentification />
		<Step2ClinicalHistoryAcquisition />
		<Step3Findings />
		<Step4MeasurementsComparison />
		<Step5ImpressionStructuredReporting />
		<Step6CriticalResultCommunication />
		<Step7InterpretationSignOff />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
