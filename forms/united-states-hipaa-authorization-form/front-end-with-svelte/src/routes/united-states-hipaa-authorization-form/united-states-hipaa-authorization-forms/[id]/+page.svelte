<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { authorization } from '$lib/stores/authorization.svelte';
	import { validateAuthorization } from '$lib/engine/validate-authorization';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleAuthorizations } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step1Patient from '$lib/components/steps/Step1Patient.svelte';
	import Step2Signer from '$lib/components/steps/Step2Signer.svelte';
	import Step3DisclosingSource from '$lib/components/steps/Step3DisclosingSource.svelte';
	import Step4AuthorizedRecipient from '$lib/components/steps/Step4AuthorizedRecipient.svelte';
	import Step5RecordsToDisclose from '$lib/components/steps/Step5RecordsToDisclose.svelte';
	import Step6PurposeOfDisclosure from '$lib/components/steps/Step6PurposeOfDisclosure.svelte';
	import Step7Expiration from '$lib/components/steps/Step7Expiration.svelte';
	import Step8PatientRights from '$lib/components/steps/Step8PatientRights.svelte';
	import Step9SignatureWitness from '$lib/components/steps/Step9SignatureWitness.svelte';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample authorization (existing id) or
	// a blank draft (new).
	$effect(() => {
		const seed = sampleAuthorizations.find((s) => s.id === id)?.data;
		if (authorization.id !== id) {
			authorization.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = authorization.data;
		const found: { id: string; message: string }[] = [];
		if (d.patient.name.trim() === '') {
			found.push({ id: 'patient-name', message: 'Patient print name is required.' });
		}
		if (!d.patient.birthDate) {
			found.push({ id: 'patient-birthDate', message: 'Date of birth is required.' });
		}
		if (d.signer.relationship === '') {
			found.push({ id: 'signer-relationship', message: 'Signer relationship is required.' });
		}
		if (d.disclosingSource.identificationMode === '') {
			found.push({
				id: 'disclosingSource-identificationMode',
				message: 'A disclosing source is required.'
			});
		}
		if (
			d.authorizedRecipient.recipientName.trim() === '' &&
			d.authorizedRecipient.recipientOrganization.trim() === ''
		) {
			found.push({
				id: 'authorizedRecipient-recipientName',
				message: 'A recipient name or organisation is required.'
			});
		}
		if (d.purposeOfDisclosure.primaryPurpose === '') {
			found.push({
				id: 'purposeOfDisclosure-primaryPurpose',
				message: 'A primary purpose is required.'
			});
		}
		if (d.expiration.kind === '') {
			found.push({ id: 'expiration-kind', message: 'An expiration is required.' });
		}
		if (!d.signatureWitness.signatureDate) {
			found.push({ id: 'signatureWitness-signatureDate', message: 'A signature date is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		authorization.result = validateAuthorization(authorization.data);
		goto(`/united-states-hipaa-authorization-form/united-states-hipaa-authorization-forms/${id}/report`);
	}

	function startOver() {
		const seed = sampleAuthorizations.find((s) => s.id === id)?.data;
		authorization.reset();
		authorization.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-auto max-w-3xl px-4 py-6">
	<header class="mb-6 no-print">
		<h1 class="text-2xl font-bold text-base-content">
			{isNew ? 'New HIPAA authorization' : `HIPAA authorization ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the nine sections; the validity check runs on submit per 45 CFR § 164.508.
		</p>
		<Progress label="Authorization sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Authorization sections" current={TOTAL_STEPS}>
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

	<Form label="HIPAA authorization" onsubmit={submit}>
		<Step1Patient />
		<Step2Signer />
		<Step3DisclosingSource />
		<Step4AuthorizedRecipient />
		<Step5RecordsToDisclose />
		<Step6PurposeOfDisclosure />
		<Step7Expiration />
		<Step8PatientRights />
		<Step9SignatureWitness />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Check validity &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
