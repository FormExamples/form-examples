<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateMatB1 } from '$lib/engine/mat-b1-validator';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1PatientIdentification from '$lib/components/steps/Step1PatientIdentification.svelte';
	import Step2PreConfinement from '$lib/components/steps/Step2PreConfinement.svelte';
	import Step3PostConfinement from '$lib/components/steps/Step3PostConfinement.svelte';
	import Step4IssuerValidation from '$lib/components/steps/Step4IssuerValidation.svelte';

	const plural = 'united-kingdom-maternity-certificates-mat-b1';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample certificate (existing id) or
	// a blank draft (new).
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
			found.push({ id: 'patientName', message: "Patient's name is required." });
		}
		if (d.issuer.certificateNumber.trim() === '') {
			found.push({ id: 'certificateNumber', message: 'Unique certificate number is required.' });
		}
		if (d.issuer.issueDate === '') {
			found.push({ id: 'issueDate', message: 'Issue date is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = validateMatB1(assessment.data);
		goto(`/${plural}/${id}/report`);
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
			{isNew ? 'New MAT B1 certificate' : `MAT B1 certificate ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the four sections; the certificate is validated on submit.
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

	<Form label="MAT B1 certificate" onsubmit={submit}>
		<Step1PatientIdentification />
		<Step2PreConfinement />
		<Step3PostConfinement />
		<Step4IssuerValidation />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Validate &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
