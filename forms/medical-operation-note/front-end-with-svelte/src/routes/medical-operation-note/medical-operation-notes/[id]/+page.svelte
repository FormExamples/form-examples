<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { store } from '$lib/state.svelte';
	import { STEPS, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleOperationNotes } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1 from '$lib/steps/Step1Identification.svelte';
	import Step2 from '$lib/steps/Step2PatientIdentification.svelte';
	import Step3 from '$lib/steps/Step3SurgicalTeam.svelte';
	import Step4 from '$lib/steps/Step4DiagnosesProcedures.svelte';
	import Step5 from '$lib/steps/Step5Anaesthesia.svelte';
	import Step6 from '$lib/steps/Step6PositionPrepApproach.svelte';
	import Step7 from '$lib/steps/Step7OperativeFindings.svelte';
	import Step8 from '$lib/steps/Step8MaterialsImplants.svelte';
	import Step9 from '$lib/steps/Step9DrainsPacksSpecimens.svelte';
	import Step10 from '$lib/steps/Step10SafetyCountsEbl.svelte';
	import Step11 from '$lib/steps/Step11PostOperativePlan.svelte';
	import Step12 from '$lib/steps/Step12SignOff.svelte';

	const stepComponents = [
		Step1, Step2, Step3, Step4, Step5, Step6, Step7, Step8, Step9, Step10, Step11, Step12,
	];

	let errorSummaryEl = $state<HTMLDivElement | null>(null);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample note (existing id) or a blank
	// draft (new).
	$effect(() => {
		const seed = sampleOperationNotes.find((s) => s.id === id)?.data;
		if (store.id !== id) {
			store.loadForId(id, seed);
		}
	});

	const errorEntries = $derived(Object.entries(store.errors));

	function focusErrorSummary() {
		queueMicrotask(() => errorSummaryEl?.focus());
	}

	function submit() {
		const errors = store.validate();
		store.errors = errors;
		if (Object.keys(errors).length > 0) {
			store.errorSummaryHidden = false;
			focusErrorSummary();
			return;
		}
		store.errorSummaryHidden = true;
		store.submitted = true;
		goto(`/medical-operation-note/medical-operation-notes/${id}/report`);
	}

	function startOver() {
		const seed = sampleOperationNotes.find((s) => s.id === id)?.data;
		store.reset();
		store.loadForId(id, seed);
	}

	function gotoStep(n: number) {
		store.goto(n);
		document.getElementById(`step-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
</script>

<main class="mx-16 px-4 py-6">
	<h1 class="text-2xl font-bold text-base-content">
		{isNew ? 'New operation note' : `Operation note ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the twelve sections; the composite operative risk, Clavien–Dindo grade, blood-loss
		band, and safety flags are computed on submit.
	</p>
	<Progress label="Form completion" max={100} value={store.percentComplete} />
	<p class="mt-1 text-sm text-base-content/60" aria-live="polite">{store.percentComplete}% complete</p>
	<StepList label="Operation note sections" current={store.currentStep - 1}>
		{#each store.steps as s (s.number)}
			<StepListItem
				status={s.status}
				current={s.number === store.currentStep}
				onclick={() => gotoStep(s.number)}
			>
				{s.short}
			</StepListItem>
		{/each}
	</StepList>

	{#if !store.errorSummaryHidden && errorEntries.length > 0}
		<div bind:this={errorSummaryEl} class="mb-6" tabindex="-1">
			<ErrorSummary title="There is a problem">
				<ul>
					{#each errorEntries as [eid, message] (eid)}
						<li><a href={`#${eid}`}>{message}</a></li>
					{/each}
				</ul>
			</ErrorSummary>
		</div>
	{/if}

	<Form label="Medical operation note" onsubmit={submit}>
		<div id="form-sections">
			{#each stepComponents as StepComponent, i (i)}
				<section
					id={`step-${i + 1}`}
					class="step-section"
					onmouseenter={() => store.goto(i + 1)}
					onfocusin={() => store.goto(i + 1)}
					aria-label={STEPS[i]?.title ?? `Step ${i + 1}`}
				>
					<StepComponent />
				</section>
			{/each}
		</div>

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
