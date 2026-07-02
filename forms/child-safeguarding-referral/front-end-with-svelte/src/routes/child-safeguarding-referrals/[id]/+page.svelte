<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateSafeguardingGrade } from '$lib/engine/child-safeguarding-grader';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAssessments } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Referrer from '$lib/components/steps/Step1Referrer.svelte';
	import Step2Child from '$lib/components/steps/Step2Child.svelte';
	import Step3Family from '$lib/components/steps/Step3Family.svelte';
	import Step4Concern from '$lib/components/steps/Step4Concern.svelte';
	import Step5Category from '$lib/components/steps/Step5Category.svelte';
	import Step6Risk from '$lib/components/steps/Step6Risk.svelte';
	import Step7Consent from '$lib/components/steps/Step7Consent.svelte';
	import Step8Informed from '$lib/components/steps/Step8Informed.svelte';
	import Step9Action from '$lib/components/steps/Step9Action.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample referral (existing id) or a
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
		if (d.referrer.referrerName.trim() === '') {
			found.push({ id: 'referrer-referrerName', message: 'Referrer name is required.' });
		}
		if (d.referrer.referrerPhone.trim() === '' && d.referrer.referrerEmail.trim() === '') {
			found.push({
				id: 'referrer-referrerPhone',
				message: 'A referrer contact (phone or email) is required.'
			});
		}
		if (d.child.childName.trim() === '') {
			found.push({ id: 'child-childName', message: 'Child name is required.' });
		}
		if (d.concern.concernDescription.trim() === '') {
			found.push({
				id: 'concern-concernDescription',
				message: 'A description of the concern is required.'
			});
		}
		if (d.category.primaryCategory === '') {
			found.push({
				id: 'category-primaryCategory',
				message: 'A primary category of abuse is required.'
			});
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		assessment.result = calculateSafeguardingGrade(assessment.data);
		goto(`/child-safeguarding-referrals/${id}/report`);
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
			{isNew ? 'New child safeguarding referral' : `Referral ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the nine sections; the completeness status, urgency, and flags are computed on
			submit.
		</p>
		<Progress label="Referral sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Referral sections" current={TOTAL_STEPS}>
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

	<Form label="Child safeguarding referral" onsubmit={submit}>
		<Step1Referrer />
		<Step2Child />
		<Step3Family />
		<Step4Concern />
		<Step5Category />
		<Step6Risk />
		<Step7Consent />
		<Step8Informed />
		<Step9Action />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Check referral &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
