<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { validateChecklist } from '$lib/engine/checklist-validator';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1EmployeeDetails from '$lib/components/steps/Step1EmployeeDetails.svelte';
	import Step2ExitInterview from '$lib/components/steps/Step2ExitInterview.svelte';
	import Step3KnowledgeTransfer from '$lib/components/steps/Step3KnowledgeTransfer.svelte';
	import Step4EquipmentReturn from '$lib/components/steps/Step4EquipmentReturn.svelte';
	import Step5AccessRevocation from '$lib/components/steps/Step5AccessRevocation.svelte';
	import Step6FinalPayrollBenefits from '$lib/components/steps/Step6FinalPayrollBenefits.svelte';
	import Step7ReferencesRecommendations from '$lib/components/steps/Step7ReferencesRecommendations.svelte';
	import Step8NonDisclosurePostEmployment from '$lib/components/steps/Step8NonDisclosurePostEmployment.svelte';
	import Step9ForwardingDetails from '$lib/components/steps/Step9ForwardingDetails.svelte';
	import Step10Signoff from '$lib/components/steps/Step10Signoff.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample checklist (existing id) or a
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
		if (d.employeeDetails.firstName.trim() === '') {
			found.push({ id: 'firstName', message: 'Employee first name is required.' });
		}
		if (d.employeeDetails.lastName.trim() === '') {
			found.push({ id: 'lastName', message: 'Employee last name is required.' });
		}
		if (d.employeeDetails.lastWorkingDay === '') {
			found.push({ id: 'lastWorkingDay', message: 'Last working day is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = validateChecklist(assessment.data);
		goto(`/employee-offboarding-checklist/employee-offboarding-checklists/${id}/report`);
	}

	function startOver() {
		const seed = sampleAssessments.find((s) => s.id === id)?.data;
		assessment.reset();
		assessment.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-16 px-4 py-6">
	<h1 class="text-2xl font-bold text-base-content">
		{isNew ? 'New offboarding checklist' : `Offboarding checklist ${id}`}
	</h1>
	<p class="mt-1 text-sm text-base-content/70">
		Complete the ten sections; the completeness outcome and flags are computed on submit.
	</p>
	<Progress label="Checklist sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
	<StepList label="Checklist sections" current={TOTAL_STEPS}>
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

	<Form label="Offboarding checklist" onsubmit={submit}>
		<Step1EmployeeDetails />
		<Step2ExitInterview />
		<Step3KnowledgeTransfer />
		<Step4EquipmentReturn />
		<Step5AccessRevocation />
		<Step6FinalPayrollBenefits />
		<Step7ReferencesRecommendations />
		<Step8NonDisclosurePostEmployment />
		<Step9ForwardingDetails />
		<Step10Signoff />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Validate &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
