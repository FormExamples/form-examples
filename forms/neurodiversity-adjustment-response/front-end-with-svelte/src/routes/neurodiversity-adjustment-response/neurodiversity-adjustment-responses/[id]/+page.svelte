<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { resultStore } from '$lib/stores/result.svelte';
	import { calculateGrade } from '$lib/engine/grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleReports } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1ResponseIdentification from '$lib/components/steps/Step1ResponseIdentification.svelte';
	import Step2WorkerIdentification from '$lib/components/steps/Step2WorkerIdentification.svelte';
	import Step3Decision from '$lib/components/steps/Step3Decision.svelte';
	import Step4AdjustmentsAgreed from '$lib/components/steps/Step4AdjustmentsAgreed.svelte';
	import Step5TrialAndReview from '$lib/components/steps/Step5TrialAndReview.svelte';
	import Step6SupportAndResponsibilities from '$lib/components/steps/Step6SupportAndResponsibilities.svelte';
	import Step7SignOff from '$lib/components/steps/Step7SignOff.svelte';

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Request → response handoff: the request form's "Draft the employer response"
	// action leaves the worker/manager identity and the requested adjustment
	// categories in localStorage; consume them into a fresh draft.
	const HANDOFF_KEY = 'neurodiversity-adjustment.handoff.v1';
	const CATEGORY_LABELS: Record<string, string> = {
		'working-environment': 'Working environment',
		'equipment-technology': 'Equipment / technology',
		'working-arrangements': 'Working arrangements',
		communication: 'Communication',
		'support-mentoring': 'Support / mentoring',
		'recruitment-process': 'Recruitment process',
		'policy-dress': 'Policy / dress code',
		other: 'Other'
	};
	interface Handoff {
		requestReference?: string;
		worker?: { name?: string; jobTitle?: string; department?: string };
		manager?: { name?: string; jobTitle?: string; department?: string };
		requestedCategories?: string[];
	}
	let requestedCategories = $state<string[]>([]);

	function readHandoff(): Handoff | null {
		if (!browser) return null;
		try {
			const raw = localStorage.getItem(HANDOFF_KEY);
			return raw ? (JSON.parse(raw) as Handoff) : null;
		} catch {
			return null;
		}
	}

	// Load the draft for this id whenever the route param changes. A pending
	// handoff (fresh drafts only) wins; otherwise seed from a known sample row.
	$effect(() => {
		const current = id;
		if (resultStore.id === current) return;
		if (current === 'new') {
			const h = readHandoff();
			if (h) {
				resultStore.loadForId(current, {
					workerName: h.worker?.name ?? '',
					workerJobTitle: h.worker?.jobTitle ?? '',
					workerDepartment: h.worker?.department ?? '',
					managerName: h.manager?.name ?? '',
					managerJobTitle: h.manager?.jobTitle ?? '',
					managerDepartment: h.manager?.department ?? '',
					requestReference: h.requestReference ?? ''
				});
				requestedCategories = h.requestedCategories ?? [];
				if (browser) {
					try {
						localStorage.removeItem(HANDOFF_KEY);
					} catch {
						/* ignore */
					}
				}
				return;
			}
		}
		const sample = sampleReports.find((r) => r.id === current);
		resultStore.loadForId(
			current,
			sample
				? {
						workerName: sample.workerName,
						responseStatus: sample.responseStatus,
						respondedDate: sample.respondedDate
					}
				: undefined
		);
	});

	let errors = $state<{ id: string; message: string }[]>([]);

	function validate(): boolean {
		const d = resultStore.data;
		const found: { id: string; message: string }[] = [];
		if (d.managerName.trim() === '') {
			found.push({ id: 'managerName', message: 'Responding manager / HR contact is required.' });
		}
		if (d.responseStatus === '') {
			found.push({ id: 'responseStatus', message: 'Response status is required.' });
		}
		if (d.workerName.trim() === '') {
			found.push({ id: 'workerName', message: 'Worker name is required.' });
		}
		if (d.overallDecision === '') {
			found.push({ id: 'overallDecision', message: 'Overall decision is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		resultStore.result = calculateGrade(resultStore.data);
		goto(`/neurodiversity-adjustment-response/neurodiversity-adjustment-responses/${id}/report`);
	}

	function startOver() {
		resultStore.reset();
		errors = [];
	}
</script>

<main class="mx-auto max-w-3xl px-4 py-6">
	<header class="mb-6 no-print">
		<h1 class="text-2xl font-bold text-base-content">
			{isNew ? 'New adjustment response' : `Adjustment response ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the seven sections; the four-axis grade is computed on submit.
		</p>
		<Progress label="Response sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Response sections" current={TOTAL_STEPS}>
			{#each steps as step (step.number)}
				<StepListItem status="finished" label={step.title}>{step.shortTitle}</StepListItem>
			{/each}
		</StepList>
	</header>

	{#if requestedCategories.length > 0}
		<div
			class="mb-6 rounded-md border-l-4 border-primary bg-primary/10 px-4 py-3 text-sm"
			role="note"
		>
			<strong>Adjustments requested by the worker:</strong>
			{requestedCategories.map((c) => CATEGORY_LABELS[c] ?? c).join(', ')}.
			<span class="block text-base-content/70">
				Mark each one agreed, offer an alternative, or record why it is declined.
			</span>
		</div>
	{/if}

	{#if errors.length > 0}
		<ErrorSummary title="Please fix the following before submitting" class="mb-6">
			<ul>
				{#each errors as e (e.id)}
					<li><a href={`#${e.id}`}>{e.message}</a></li>
				{/each}
			</ul>
		</ErrorSummary>
	{/if}

	<Form label="Neurodiversity adjustment response" onsubmit={submit}>
		<Step1ResponseIdentification />
		<Step2WorkerIdentification />
		<Step3Decision />
		<Step4AdjustmentsAgreed />
		<Step5TrialAndReview />
		<Step6SupportAndResponsibilities />
		<Step7SignOff />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Compute grade &amp; view response</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
