<script lang="ts">
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import { request } from '#lib/stores/request.svelte.js';
	import { eegTypeLabel, indicationLabel, settingLabel, triageTierLabel } from '#lib/engine/utils.js';

	const d = request.data;

	const patientName = $derived([d.patient.firstName, d.patient.lastName].filter(Boolean).join(' '));
</script>

<Fieldset legend="7. Review and Submit">
	<p class="hint">
		Review the request below, then compute the four-axis vetting grade. You can go back and edit any
		section before submitting.
	</p>

	<dl class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
		<div>
			<dt class="font-medium text-base-content/70">Requesting clinician</dt>
			<dd>{d.clinician.clinicianName || 'Not specified'}</dd>
		</div>
		<div>
			<dt class="font-medium text-base-content/70">Patient</dt>
			<dd>{patientName || 'Not specified'}</dd>
		</div>
		<div>
			<dt class="font-medium text-base-content/70">NHS number</dt>
			<dd>{d.patient.nhsNumber || 'Not specified'}</dd>
		</div>
		<div>
			<dt class="font-medium text-base-content/70">Requested EEG type</dt>
			<dd>{eegTypeLabel(d.request.eegType)}</dd>
		</div>
		<div>
			<dt class="font-medium text-base-content/70">Primary indication</dt>
			<dd>{indicationLabel(d.request.primaryIndication)}</dd>
		</div>
		<div>
			<dt class="font-medium text-base-content/70">Requested urgency</dt>
			<dd>{triageTierLabel(d.triage.urgency)}</dd>
		</div>
		<div>
			<dt class="font-medium text-base-content/70">Care setting</dt>
			<dd>{settingLabel(d.triage.setting)}</dd>
		</div>
	</dl>

	<h3 class="mt-4 mb-1 font-semibold text-base-content/80">Clinical question</h3>
	<p class="text-sm text-base-content/80">{d.request.clinicalQuestion || 'Not specified'}</p>
</Fieldset>
