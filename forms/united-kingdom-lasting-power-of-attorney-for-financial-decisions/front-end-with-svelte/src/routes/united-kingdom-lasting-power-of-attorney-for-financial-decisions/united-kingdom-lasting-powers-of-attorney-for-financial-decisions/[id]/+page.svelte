<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { store } from '$lib/stores/lpa.svelte';
	import { STEPS, TOTAL_STEPS } from '$lib/config/steps';
	import { findSampleLpa } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Donor from '$lib/components/steps/Step1Donor.svelte';
	import Step2Attorneys from '$lib/components/steps/Step2Attorneys.svelte';
	import Step3DecisionMode from '$lib/components/steps/Step3DecisionMode.svelte';
	import Step4ReplacementAttorneys from '$lib/components/steps/Step4ReplacementAttorneys.svelte';
	import Step5WhenAttorneysCanAct from '$lib/components/steps/Step5WhenAttorneysCanAct.svelte';
	import Step6PeopleToNotify from '$lib/components/steps/Step6PeopleToNotify.svelte';
	import Step7PreferencesAndInstructions from '$lib/components/steps/Step7PreferencesAndInstructions.svelte';
	import Step8LegalRights from '$lib/components/steps/Step8LegalRights.svelte';
	import Step9DonorSignature from '$lib/components/steps/Step9DonorSignature.svelte';
	import Step10CertificateProviderSignature from '$lib/components/steps/Step10CertificateProviderSignature.svelte';
	import Step11AttorneySignatures from '$lib/components/steps/Step11AttorneySignatures.svelte';
	import Step12Applicant from '$lib/components/steps/Step12Applicant.svelte';
	import Step13Recipient from '$lib/components/steps/Step13Recipient.svelte';
	import Step14ApplicationFee from '$lib/components/steps/Step14ApplicationFee.svelte';
	import Step15RegistrationSignature from '$lib/components/steps/Step15RegistrationSignature.svelte';

	const plural = 'united-kingdom-lasting-powers-of-attorney-for-financial-decisions';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample LPA (existing id) or a blank
	// draft (new).
	$effect(() => {
		const seed = findSampleLpa(id);
		if (store.id !== id) {
			store.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = store.data;
		const found: { id: string; message: string }[] = [];
		if (d.donor.lastName.trim() === '') {
			found.push({ id: 'donor-lastName', message: 'Donor last name is required.' });
		}
		if (d.donor.dateOfBirth === '') {
			found.push({ id: 'donor-dateOfBirth', message: 'Donor date of birth is required.' });
		}
		if (d.attorneys.length === 0) {
			found.push({ id: 'step-attorneys', message: 'At least one attorney must be appointed.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		goto(`/united-kingdom-lasting-power-of-attorney-for-financial-decisions/${plural}/${id}/report`);
	}

	function startOver() {
		const seed = findSampleLpa(id);
		store.reset();
		store.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-auto max-w-3xl px-4 py-6">
	<header class="mb-6 no-print">
		<h1 class="text-2xl font-bold text-base-content">
			{isNew ? 'New lasting power of attorney (LP1F)' : `Lasting power of attorney ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete all 15 LP1F sections; the validity band, composite risk, statutory blockers and flags
			are computed live and shown on the report.
		</p>
		<Progress label="LP1F sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="LP1F sections" current={TOTAL_STEPS}>
			{#each STEPS as step (step.number)}
				<StepListItem status="finished" label={step.title}>{step.short}</StepListItem>
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

	<Form label="Lasting power of attorney (LP1F)" onsubmit={submit}>
		<div class="space-y-8">
			<Step1Donor />
			<Step2Attorneys />
			<Step3DecisionMode />
			<Step4ReplacementAttorneys />
			<Step5WhenAttorneysCanAct />
			<Step6PeopleToNotify />
			<Step7PreferencesAndInstructions />
			<Step8LegalRights />
			<Step9DonorSignature />
			<Step10CertificateProviderSignature />
			<Step11AttorneySignatures />
			<Step12Applicant />
			<Step13Recipient />
			<Step14ApplicationFee />
			<Step15RegistrationSignature />
		</div>

		<div class="button-group mt-8">
			<Button type="submit" data-variant="primary">Validate &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
