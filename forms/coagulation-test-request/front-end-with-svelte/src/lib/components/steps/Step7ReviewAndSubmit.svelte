<script lang="ts">
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import { request } from '#lib/stores/request.svelte.js';
	import { selectedTestLabels, indicationLabel } from '#lib/engine/defaults.js';

	const d = request.data;
	const tests = $derived(selectedTestLabels(d.tests));
</script>

<Fieldset legend="7. Review and Submit">
	<p class="hint">
		Check your answers, then submit to compute the four-axis grade (appropriateness, pre-analytical,
		completeness, triage) and safety flags.
	</p>

	<dl class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
		<div>
			<dt class="font-medium text-base-content/70">Patient</dt>
			<dd>{[d.patient.firstName, d.patient.lastName].filter(Boolean).join(' ') || 'Not specified'}</dd>
		</div>
		<div>
			<dt class="font-medium text-base-content/70">Requesting clinician</dt>
			<dd>{d.clinician.clinicianName || 'Not specified'}</dd>
		</div>
		<div>
			<dt class="font-medium text-base-content/70">Primary indication</dt>
			<dd>{indicationLabel(d.clinical.primaryIndication) || 'Not specified'}</dd>
		</div>
		<div>
			<dt class="font-medium text-base-content/70">Requested urgency</dt>
			<dd>{d.triage.urgency || 'Not specified'}</dd>
		</div>
	</dl>

	<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Requested tests</h3>
	{#if tests.length > 0}
		<ul class="list-disc pl-5 text-sm text-base-content/80">
			{#each tests as label (label)}
				<li>{label}</li>
			{/each}
		</ul>
	{:else}
		<p class="text-sm text-base-content/80">No tests selected yet.</p>
	{/if}
</Fieldset>
