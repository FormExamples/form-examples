<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { STEPS } from '$lib/config/steps';
	import { TOTAL_ITEMS } from '$lib/config/items';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step01 from '$lib/components/steps/Step01InspectionDetails.svelte';
	import Step02 from '$lib/components/steps/Step02Opd.svelte';
	import Step03 from '$lib/components/steps/Step03Causality.svelte';
	import Step04 from '$lib/components/steps/Step04Dispensary.svelte';
	import Step05 from '$lib/components/steps/Step05HrAttendance.svelte';
	import Step06 from '$lib/components/steps/Step06Ambulance.svelte';
	import Step07 from '$lib/components/steps/Step07DiagnosticFacility.svelte';
	import Step08 from '$lib/components/steps/Step08Store.svelte';
	import Step09 from '$lib/components/steps/Step09OtIcu.svelte';
	import Step10 from '$lib/components/steps/Step10LabourRoom.svelte';
	import Step11 from '$lib/components/steps/Step11Wards.svelte';
	import Step12 from '$lib/components/steps/Step12HouseKeeping.svelte';
	import Step13 from '$lib/components/steps/Step13WaterSupply.svelte';
	import Step14 from '$lib/components/steps/Step14ElectricSupply.svelte';
	import Step15 from '$lib/components/steps/Step15Diet.svelte';
	import Step16 from '$lib/components/steps/Step16HospitalSignage.svelte';
	import Step17 from '$lib/components/steps/Step17FireFightingEquipment.svelte';
	import Step18 from '$lib/components/steps/Step18PatientFeedback.svelte';
	import Step19 from '$lib/components/steps/Step19Mortuary.svelte';
	import Step20 from '$lib/components/steps/Step20HospitalFurniture.svelte';
	import Step21 from '$lib/components/steps/Step21WasteManagement.svelte';
	import Step22 from '$lib/components/steps/Step22InfectionControl.svelte';
	import Step23 from '$lib/components/steps/Step23RecordRoom.svelte';
	import Step24 from '$lib/components/steps/Step24Summary.svelte';

	// 24 steps, auto-wrapped: inspection details (1), one per hospital area
	// (2-23, 22 areas), summary & sign-off (24).
	const stepComponents = [
		Step01, Step02, Step03, Step04, Step05, Step06, Step07, Step08,
		Step09, Step10, Step11, Step12, Step13, Step14, Step15, Step16,
		Step17, Step18, Step19, Step20, Step21, Step22, Step23, Step24
	];

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');
	const result = $derived(assessment.result);

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample round (existing id) or a
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
		if (d.inspectionDetails.hospitalName.trim() === '') {
			found.push({ id: 'hospitalName', message: 'Hospital / facility name is required.' });
		}
		if (d.inspectionDetails.inspectionDate.trim() === '') {
			found.push({ id: 'inspectionDate', message: 'Inspection date is required.' });
		}
		if (d.inspectionDetails.inspectingOfficerName.trim() === '') {
			found.push({ id: 'inspectingOfficerName', message: 'Inspecting officer name is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		goto(`/hospital-daily-monitoring-checklist/hospital-daily-monitoring-checklists/${id}/report`);
	}

	function startOver() {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
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
		{isNew ? 'New inspection round' : `Inspection round ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete inspection details, all 22 hospital areas, and sign-off; the checkpoints-answered and
		needs-attention tally are computed as you go.
	</p>
	<Progress label="Checkpoints answered" max={TOTAL_ITEMS} value={result.answeredCount} />
	<p class="mt-1 text-sm text-base-content/60" aria-live="polite">
		{result.answeredCount} of {TOTAL_ITEMS} checkpoints answered
		{#if result.needsAttentionCount > 0}
			· {result.needsAttentionCount} needing attention
		{/if}
	</p>
	<StepList label="Hospital daily monitoring checklist steps" current={assessment.currentStep - 1}>
		{#each STEPS as s (s.number)}
			<StepListItem
				status={stepStatus(s.number)}
				current={s.number === assessment.currentStep}
				onclick={() => gotoStep(s.number)}
			>
				{s.short}
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

	<Form label="Hospital daily monitoring checklist" onsubmit={submit}>
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
