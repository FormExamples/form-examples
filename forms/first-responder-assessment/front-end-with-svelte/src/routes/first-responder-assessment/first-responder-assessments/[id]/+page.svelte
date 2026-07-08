<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateResponderGrade } from '$lib/engine/responder-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Demographics from '$lib/components/steps/Step1Demographics.svelte';
	import Step2RoleQualifications from '$lib/components/steps/Step2RoleQualifications.svelte';
	import Step3PhysicalFitness from '$lib/components/steps/Step3PhysicalFitness.svelte';
	import Step4ClinicalSkills from '$lib/components/steps/Step4ClinicalSkills.svelte';
	import Step5EquipmentVehicle from '$lib/components/steps/Step5EquipmentVehicle.svelte';
	import Step6CommunicationSkills from '$lib/components/steps/Step6CommunicationSkills.svelte';
	import Step7PsychologicalReadiness from '$lib/components/steps/Step7PsychologicalReadiness.svelte';
	import Step8OccupationalHealth from '$lib/components/steps/Step8OccupationalHealth.svelte';
	import Step9CpdTraining from '$lib/components/steps/Step9CpdTraining.svelte';
	import Step10FitnessDecision from '$lib/components/steps/Step10FitnessDecision.svelte';

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
			found.push({ id: 'lastName', message: 'Responder last name is required.' });
		}
		if (d.demographics.dateOfBirth === '') {
			found.push({ id: 'dob', message: 'Date of birth is required.' });
		}
		if (d.roleQualifications.roleType === '') {
			found.push({ id: 'roleType', message: 'Role type is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateResponderGrade(assessment.data);
		goto(`/first-responder-assessment/first-responder-assessments/${id}/report`);
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
			{isNew ? 'New first responder assessment' : `First responder assessment ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the ten sections; overall competency, fitness decision, and risk are computed on
			submit.
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

	<Form label="First responder assessment" onsubmit={submit}>
		<Step1Demographics />
		<Step2RoleQualifications />
		<Step3PhysicalFitness />
		<Step4ClinicalSkills />
		<Step5EquipmentVehicle />
		<Step6CommunicationSkills />
		<Step7PsychologicalReadiness />
		<Step8OccupationalHealth />
		<Step9CpdTraining />
		<Step10FitnessDecision />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute grade &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
