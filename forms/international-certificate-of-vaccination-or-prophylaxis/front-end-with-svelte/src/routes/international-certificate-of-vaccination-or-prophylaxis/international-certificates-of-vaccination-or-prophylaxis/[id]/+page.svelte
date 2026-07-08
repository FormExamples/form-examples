<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { certificateStore } from '$lib/stores/certificate.svelte';
	import { validateCertificate } from '$lib/engine/validation-rules';
	import { steps, TOTAL_STEPS } from '$lib/config/steps';
	import { sampleCertificates } from '$lib/data/sample-reports';

	import Form from '$lib/components/ui/Form.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Progress from '$lib/components/ui/Progress.svelte';
	import StepList from '$lib/components/ui/StepList.svelte';
	import StepListItem from '$lib/components/ui/StepListItem.svelte';
	import ErrorSummary from '$lib/components/ui/ErrorSummary.svelte';

	import Step01CentreAndClinician from '$lib/components/steps/Step01CentreAndClinician.svelte';
	import Step02VaccineeIdentity from '$lib/components/steps/Step02VaccineeIdentity.svelte';
	import Step03VaccineeSignature from '$lib/components/steps/Step03VaccineeSignature.svelte';
	import Step04TravelContext from '$lib/components/steps/Step04TravelContext.svelte';
	import Step05EntryDiseaseVaccine from '$lib/components/steps/Step05EntryDiseaseVaccine.svelte';
	import Step06EntryAdministration from '$lib/components/steps/Step06EntryAdministration.svelte';
	import Step07EntryValidityStamp from '$lib/components/steps/Step07EntryValidityStamp.svelte';
	import Step08Summary from '$lib/components/steps/Step08Summary.svelte';

	const plural = 'international-certificates-of-vaccination-or-prophylaxis';

	let errors = $state<{ id: string; message: string }[]>([]);

	const id = $derived(page.params.id ?? 'new');
	const isNew = $derived(id === 'new');

	// Hydrate the wizard whenever the route id changes: a saved draft for that id
	// wins, otherwise seed from the matching sample certificate (existing id) or a
	// blank draft (new).
	$effect(() => {
		const seed = sampleCertificates.find((s) => s.id === id)?.data;
		if (certificateStore.id !== id) {
			certificateStore.loadForId(id, seed);
			errors = [];
		}
	});

	function validate(): boolean {
		const d = certificateStore.data;
		const found: { id: string; message: string }[] = [];
		if (d.center.name.trim() === '') {
			found.push({ id: 'centreName', message: 'Centre name is required.' });
		}
		if (d.clinician.name.trim() === '') {
			found.push({ id: 'clinicianName', message: 'Supervising clinician name is required.' });
		}
		if (d.patient.surname.trim() === '') {
			found.push({ id: 'surname', message: 'Vaccinee surname is required.' });
		}
		if (d.patient.birthDate === '') {
			found.push({ id: 'birthDate', message: 'Date of birth is required.' });
		}
		if (d.entries[0]?.disease === '') {
			found.push({ id: 'disease', message: 'Disease is required.' });
		}
		if (d.entries[0]?.vaccinationDate === '') {
			found.push({ id: 'vaccinationDate', message: 'Date of vaccination is required.' });
		}
		errors = found;
		return found.length === 0;
	}

	function submit() {
		if (!validate()) {
			document.querySelector('.error-summary')?.scrollIntoView({ behavior: 'smooth' });
			return;
		}
		certificateStore.result = validateCertificate(certificateStore.data);
		goto(`/international-certificate-of-vaccination-or-prophylaxis/${plural}/${id}/report`);
	}

	function startOver() {
		const seed = sampleCertificates.find((s) => s.id === id)?.data;
		certificateStore.reset();
		certificateStore.loadForId(id, seed);
		errors = [];
	}
</script>

<main class="mx-auto max-w-3xl px-4 py-6">
	<header class="mb-6 no-print">
		<h1 class="text-2xl font-bold text-base-content">
			{isNew ? 'New certificate' : `Certificate ${id}`}
		</h1>
		<p class="mt-1 text-sm text-base-content/70">
			Complete the eight sections; the certificate is validated against rules VAL001–VAL012 on submit.
		</p>
		<Progress label="Certificate sections" value={TOTAL_STEPS} max={TOTAL_STEPS} />
		<StepList label="Certificate sections" current={TOTAL_STEPS}>
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

	<Form label="International Certificate of Vaccination or Prophylaxis" onsubmit={submit}>
		<Step01CentreAndClinician />
		<Step02VaccineeIdentity />
		<Step03VaccineeSignature />
		<Step04TravelContext />
		<Step05EntryDiseaseVaccine />
		<Step06EntryAdministration />
		<Step07EntryValidityStamp />
		<Step08Summary />

		<div class="button-group">
			<Button type="submit" data-variant="primary">Validate &amp; view report</Button>
			<Button data-variant="danger" onclick={startOver}>Start over</Button>
		</div>
	</Form>
</main>
