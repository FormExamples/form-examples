<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateCertificate } from '$lib/engine/mccd-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleCertificates } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Certification from '$lib/components/steps/Step1Certification.svelte';
	import Step2Deceased from '$lib/components/steps/Step2Deceased.svelte';
	import Step3Death from '$lib/components/steps/Step3Death.svelte';
	import Step4PartI from '$lib/components/steps/Step4PartI.svelte';
	import Step5PartII from '$lib/components/steps/Step5PartII.svelte';
	import Step6Referral from '$lib/components/steps/Step6Referral.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample certificate (existing id) or a
	// blank draft (new).
	$effect(() => {
		const seed = sampleCertificates.find((s) => s.id === id)?.data;
		if (assessment.id !== id) {
			assessment.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = assessment.data;
		const found: { id: string; message: string }[] = [];
		if (d.deceased.patientIdentifier.trim() === '') {
			found.push({
				id: 'deceased-patientIdentifier',
				message: 'Patient identifier is required.'
			});
		}
		if (d.partI.causeIaCondition.trim() === '' && d.referral.referredToCoroner !== 'yes') {
			found.push({
				id: 'partI-causeIaCondition',
				message: 'Part I(a) direct cause of death is required (unless referred to the coroner).'
			});
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = validateCertificate(assessment.data);
		goto(`/medical-certificate-of-cause-of-death/medical-certificates-of-cause-of-death/${id}/report`);
	}

	function startOver() {
		const seed = sampleCertificates.find((s) => s.id === id)?.data;
		assessment.reset();
		assessment.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-auto max-w-3xl px-4 py-6">
	<header class="mb-6 no-print">
		<h1 class="text-2xl font-bold text-base-content">
			{isNew ? 'New Medical Certificate of Cause of Death' : `MCCD ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the six sections; the validity class, derived underlying cause, and flagged issues
			are computed on submit. This is a documentation instrument — there is no numeric score, and it
			does not diagnose or replace statutory judgement.
		</p>
		<Progress label="Certificate sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Certificate sections" current={TOTAL_STEPS}>
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

	<Form label="Medical Certificate of Cause of Death" onsubmit={submit}>
		<Step1Certification />
		<Step2Deceased />
		<Step3Death />
		<Step4PartI />
		<Step5PartII />
		<Step6Referral />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Validate &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
