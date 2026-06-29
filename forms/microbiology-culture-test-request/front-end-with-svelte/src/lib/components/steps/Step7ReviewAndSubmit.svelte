<script lang="ts">
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import { request } from '$lib/stores/request.svelte';
	import { specimenTypeLabel, indicationLabel, urgencyLabel, TEST_FIELDS } from '$lib/engine/utils';

	const d = request.data;

	const selectedTests = $derived(
		TEST_FIELDS.filter((t) => d.tests[t.field] === true).map((t) => t.label)
	);
	const patientName = $derived(
		[d.patient.firstName, d.patient.lastName].filter(Boolean).join(' ') || 'Not specified'
	);
</script>

<Fieldset legend="7. Review and Submit">
	<p class="hint">Check the request, then compute the four-axis vetting grade and safety flags.</p>

	<dl class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
		<div><dt class="font-medium text-base-content/70">Patient</dt><dd>{patientName}</dd></div>
		<div><dt class="font-medium text-base-content/70">NHS number</dt><dd>{d.patient.nhsNumber || 'Not specified'}</dd></div>
		<div><dt class="font-medium text-base-content/70">Requesting clinician</dt><dd>{d.clinician.clinicianName || 'Not specified'}</dd></div>
		<div><dt class="font-medium text-base-content/70">Specimen type</dt><dd>{specimenTypeLabel(d.specimen.specimenType)}</dd></div>
		<div><dt class="font-medium text-base-content/70">Specimen collected</dt><dd>{d.specimen.specimenCollected || 'Not specified'}</dd></div>
		<div><dt class="font-medium text-base-content/70">Primary indication</dt><dd>{indicationLabel(d.clinical.primaryIndication)}</dd></div>
		<div><dt class="font-medium text-base-content/70">Requested urgency</dt><dd>{urgencyLabel(d.triage.urgency)}</dd></div>
	</dl>

	<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Requested tests</h3>
	{#if selectedTests.length > 0}
		<ul class="list-disc pl-5 text-sm text-base-content/80">
			{#each selectedTests as t (t)}
				<li>{t}</li>
			{/each}
		</ul>
	{:else}
		<p class="text-sm text-base-content/80">No test selected</p>
	{/if}

	<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Clinical details</h3>
	<p class="text-sm text-base-content/80">{d.clinical.clinicalDetails || 'Not specified'}</p>
</Fieldset>
