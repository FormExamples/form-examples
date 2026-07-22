<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { STEPS, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleVisits } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step01 from '$lib/components/steps/Step01VisitDetails.svelte';
	import Step02 from '$lib/components/steps/Step02Sf36GeneralHealth.svelte';
	import Step03 from '$lib/components/steps/Step03Sf36Activities.svelte';
	import Step04 from '$lib/components/steps/Step04Sf36RoleLimitations.svelte';
	import Step05 from '$lib/components/steps/Step05Sf36Remaining.svelte';
	import Step06 from '$lib/components/steps/Step06Ndi.svelte';
	import Step07 from '$lib/components/steps/Step07Mjoa.svelte';
	import Step08 from '$lib/components/steps/Step08Eq5d.svelte';
	import Step09 from '$lib/components/steps/Step09Summary.svelte';

	// 9 steps: visit details (1), SF-36v2 across 4 steps (2-5), NDI (6),
	// mJOA (7), EQ-5D-3L (8), summary (9).
	const stepComponents = [Step01, Step02, Step03, Step04, Step05, Step06, Step07, Step08, Step09];

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample visit (existing id) or a
	// blank draft (new).
	$effect(() => {
		const seed = sampleVisits.find((s) => s.id === id)?.data;
		if (assessment.id !== id) {
			assessment.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = assessment.data.visitDetails;
		const found: { id: string; message: string }[] = [];
		if (d.subjectId.trim() === '') {
			found.push({ id: 'visitDetails-subjectId', message: 'Subject ID is required.' });
		}
		if (d.visit.trim() === '') {
			found.push({ id: 'visitDetails-visit', message: 'Visit is required.' });
		}
		if (d.assessmentDate.trim() === '') {
			found.push({ id: 'visitDetails-assessmentDate', message: 'Assessment date is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		goto(`/patient-reported-outcome-measures/patient-reported-outcome-measure-visits/${id}/report`);
	}

	function startOver() {
		const seed = sampleVisits.find((s) => s.id === id)?.data;
		assessment.reset();
		assessment.loadForId(id, seed);
		errors = [];
	}

	function gotoStep(n: number) {
		assessment.goto(n);
		document.getElementById(`step-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function stepStatus(n: number): 'waiting' | 'in-progress' | 'finished' {
		if (n < assessment.currentStep) return 'finished';
		if (n === assessment.currentStep) return 'in-progress';
		return 'waiting';
	}
</script>

<main class="mx-16 px-4 py-6">
	<h1 class="text-2xl font-bold text-base-content">
		{isNew ? 'New visit' : `Visit ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the visit header and all four instruments — SF-36v2, NDI, mJOA, and EQ-5D-3L.
	</p>
	<Progress label="Step progress" max={TOTAL_STEPS} value={assessment.currentStep} />
	<p class="mt-1 text-sm text-base-content/60" aria-live="polite">
		Step {assessment.currentStep} of {TOTAL_STEPS}
	</p>
	<StepList label="Patient-reported outcome measures steps" current={assessment.currentStep - 1}>
		{#each STEPS as s (s.number)}
			<StepListItem
				status={stepStatus(s.number)}
				current={s.number === assessment.currentStep}
				onclick={() => gotoStep(s.number)}
			>
				{s.shortTitle}
			</StepListItem>
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

	<Form label="Patient-reported outcome measures" onsubmit={submit}>
		<div id="form-sections">
			{#each stepComponents as StepComponent, i (i)}
				<section
					id={`step-${i + 1}`}
					class="mb-5"
					style="scroll-margin-top: 6rem;"
					onmouseenter={() => assessment.goto(i + 1)}
					onfocusin={() => assessment.goto(i + 1)}
					aria-label={STEPS[i].title}
				>
					<StepComponent />
				</section>
			{/each}
		</div>

		<div class="button-group">
			<Button type="submit" data-variant="primary">Generate report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
