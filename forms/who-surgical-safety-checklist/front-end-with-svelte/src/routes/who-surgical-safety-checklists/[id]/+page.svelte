<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { store } from '$lib/stores/checklist.svelte';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleChecklists } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1CaseDetails from '$lib/components/steps/Step1CaseDetails.svelte';
	import Step2SignIn from '$lib/components/steps/Step2SignIn.svelte';
	import Step3TimeOut from '$lib/components/steps/Step3TimeOut.svelte';
	import Step4SignOut from '$lib/components/steps/Step4SignOut.svelte';
	import Step5Summary from '$lib/components/steps/Step5Summary.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample checklist (existing id) or a
	// blank draft (new).
	$effect(() => {
		const seed = sampleChecklists.find((s) => s.id === id)?.data;
		if (store.id !== id) {
			store.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = store.data;
		const found: { id: string; message: string }[] = [];
		if (d.plannedProcedure.trim() === '') {
			found.push({ id: 'plannedProcedure', message: 'Planned procedure is required.' });
		}
		if (d.caseDate === '') {
			found.push({ id: 'caseDate', message: 'Case date is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		store.result = {
			status: store.status,
			flags: store.flags,
			generatedAt: new Date().toISOString()
		};
		goto(`/who-surgical-safety-checklists/${id}/report`);
	}

	function startOver() {
		const seed = sampleChecklists.find((s) => s.id === id)?.data;
		store.reset();
		store.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-auto max-w-3xl px-4 py-6">
	<header class="mb-6 no-print">
		<h1 class="text-2xl font-bold text-base-content">
			{isNew ? 'New surgical safety checklist' : `Surgical safety checklist ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the five sections; the lifecycle status and safety flags are computed on submit.
		</p>
		<Progress label="Checklist sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Checklist sections" current={TOTAL_STEPS}>
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

	<Form label="WHO Surgical Safety Checklist" onsubmit={submit}>
		<Step1CaseDetails />
		<Step2SignIn />
		<Step3TimeOut />
		<Step4SignOut />
		<Step5Summary />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute status &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
