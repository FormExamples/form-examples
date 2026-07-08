<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculatePacuGrade } from '$lib/engine/pacu-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Context from '$lib/components/steps/Step1Context.svelte';
	import Step2Identification from '$lib/components/steps/Step2Identification.svelte';
	import Step3Activity from '$lib/components/steps/Step3Activity.svelte';
	import Step4Respiration from '$lib/components/steps/Step4Respiration.svelte';
	import Step5Circulation from '$lib/components/steps/Step5Circulation.svelte';
	import Step6Consciousness from '$lib/components/steps/Step6Consciousness.svelte';
	import Step7OxygenSaturation from '$lib/components/steps/Step7OxygenSaturation.svelte';
	import Step8Observations from '$lib/components/steps/Step8Observations.svelte';
	import Step9Padss from '$lib/components/steps/Step9Padss.svelte';
	import Step10Summary from '$lib/components/steps/Step10Summary.svelte';

	const plural = 'post-anaesthesia-care-unit-records';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample record (existing id) or a
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
		if (d.context.nurseName.trim() === '') {
			found.push({ id: 'context-nurseName', message: 'Recording nurse name is required.' });
		}
		if (d.context.nurseRole === '') {
			found.push({ id: 'context-nurseRole', message: 'Recording staff role is required.' });
		}
		if (d.context.anaestheticTechnique === '') {
			found.push({
				id: 'context-anaestheticTechnique',
				message: 'Anaesthetic technique is required.'
			});
		}
		if (d.identification.patientIdentifier.trim() === '') {
			found.push({
				id: 'identification-patientIdentifier',
				message: 'Patient identifier is required.'
			});
		}
		if (d.identification.ageBand === '') {
			found.push({ id: 'identification-ageBand', message: 'Age band is required.' });
		}
		if (d.identification.sex === '') {
			found.push({ id: 'identification-sex', message: 'Sex is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculatePacuGrade(assessment.data);
		goto(`/post-anaesthesia-care-unit-record/${plural}/${id}/report`);
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
			{isNew ? 'New PACU record' : `PACU record ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the ten sections; the Modified Aldrete score and readiness band are computed on
			submit.
		</p>
		<Progress label="Record sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Record sections" current={TOTAL_STEPS}>
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

	<Form label="PACU recovery record" onsubmit={submit}>
		<Step1Context />
		<Step2Identification />
		<Step3Activity />
		<Step4Respiration />
		<Step5Circulation />
		<Step6Consciousness />
		<Step7OxygenSaturation />
		<Step8Observations />
		<Step9Padss />
		<Step10Summary />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute score &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
