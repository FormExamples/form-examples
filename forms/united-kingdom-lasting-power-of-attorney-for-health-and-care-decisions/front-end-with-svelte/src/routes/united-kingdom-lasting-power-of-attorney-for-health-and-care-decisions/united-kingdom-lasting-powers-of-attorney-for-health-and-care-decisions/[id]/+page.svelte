<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { lpaStore } from '$lib/stores/lpa.svelte';
	import { STEPS, STEP_COUNT } from '$lib/config/steps';
	import { sampleLpas } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import Panel from '$lib/components/ui/Panel.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step01Donor from '$lib/components/steps/Step01Donor.svelte';
	import Step02Scope from '$lib/components/steps/Step02Scope.svelte';
	import Step03Attorneys from '$lib/components/steps/Step03Attorneys.svelte';
	import Step04DecisionRule from '$lib/components/steps/Step04DecisionRule.svelte';
	import Step05ReplacementAttorneys from '$lib/components/steps/Step05ReplacementAttorneys.svelte';
	import Step06LifeSustainingTreatment from '$lib/components/steps/Step06LifeSustainingTreatment.svelte';
	import Step07Preferences from '$lib/components/steps/Step07Preferences.svelte';
	import Step08Instructions from '$lib/components/steps/Step08Instructions.svelte';
	import Step09PeopleToNotify from '$lib/components/steps/Step09PeopleToNotify.svelte';
	import Step10CertificateProvider from '$lib/components/steps/Step10CertificateProvider.svelte';
	import Step11DonorSignature from '$lib/components/steps/Step11DonorSignature.svelte';
	import Step12AttorneySignatures from '$lib/components/steps/Step12AttorneySignatures.svelte';
	import Step13Registration from '$lib/components/steps/Step13Registration.svelte';

	const plural = 'united-kingdom-lasting-powers-of-attorney-for-health-and-care-decisions';

	const stepComponents = [
		Step01Donor,
		Step02Scope,
		Step03Attorneys,
		Step04DecisionRule,
		Step05ReplacementAttorneys,
		Step06LifeSustainingTreatment,
		Step07Preferences,
		Step08Instructions,
		Step09PeopleToNotify,
		Step10CertificateProvider,
		Step11DonorSignature,
		Step12AttorneySignatures,
		Step13Registration
	];

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample application (existing id) or a
	// blank draft (new).
	$effect(() => {
		const seed = sampleLpas.find((s) => s.id === id)?.application;
		if (lpaStore.id !== id) {
			lpaStore.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = lpaStore.application.donor;
		const found: { id: string; message: string }[] = [];
		if (d.givenNames.trim() === '' || d.familyName.trim() === '') {
			found.push({ id: 'donor', message: 'Donor given names and family name are required.' });
		}
		if (d.birthDate === '') {
			found.push({ id: 'donor', message: 'Donor date of birth is required.' });
		}
		if (d.jurisdiction === '') {
			found.push({ id: 'donor', message: 'Donor jurisdiction (England or Wales) is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		lpaStore.recompute();
		goto(`/united-kingdom-lasting-power-of-attorney-for-health-and-care-decisions/${plural}/${id}/report`);
	}

	function startOver() {
		const seed = sampleLpas.find((s) => s.id === id)?.application;
		lpaStore.reset();
		lpaStore.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-auto max-w-3xl px-4 py-6">
	<header class="mb-6 no-print">
		<h1 class="text-2xl font-bold text-base-content">
			{isNew ? 'New LP1H application' : `LP1H application ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the {STEP_COUNT} sections; statutory validity and flagged issues are computed on submit.
		</p>
		<div class="mt-4">
			<Progress label="LP1H sections" value={STEP_COUNT} max={STEP_COUNT} />
		</div>
		<ol class="mt-3 grid gap-1 text-sm text-base-content/70 sm:grid-cols-2">
			{#each STEPS.slice(0, STEP_COUNT) as step (step.number)}
				<li>
					<span class="font-mono text-xs text-base-content/60">{step.lp1hSection}</span>
					{step.title}
				</li>
			{/each}
		</ol>
	</header>

	{#if errors.length > 0}
		<ErrorSummary title="Please fix the following before submitting" class="mb-6">
			<ul>
				{#each errors as e (e.message)}
					<li><a href={`#${e.id}`}>{e.message}</a></li>
				{/each}
			</ul>
		</ErrorSummary>
	{/if}

	<Form label="LP1H application" onsubmit={submit}>
		{#each STEPS.slice(0, STEP_COUNT) as step, i (step.number)}
			{@const StepComponent = stepComponents[i]}
			<Panel label={step.title} class="mb-6">
				<header class="mb-4" id={step.number === 1 ? 'donor' : undefined}>
					<p class="text-xs uppercase tracking-wide text-base-content/60">LP1H {step.lp1hSection}</p>
					<h2 class="text-xl font-semibold text-base-content">{step.title}</h2>
					<p class="mt-1 text-sm text-base-content/70">{step.description}</p>
				</header>
				<StepComponent />
			</Panel>
		{/each}

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute validity &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
