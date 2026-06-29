<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { request } from '$lib/stores/request.svelte';
	import { bodyRegionLabel, indicationLabel, contrastLabel } from '$lib/engine/utils';

	const data = request.data;
</script>

<Fieldset legend="8. Review and Submit">
	<p class="hint">Add any notes, then submit to compute the four-axis grade and safety flags.</p>

	<div class="rounded-lg border border-base-300 bg-base-100 p-4 text-sm">
		<dl class="grid grid-cols-1 gap-2 sm:grid-cols-2">
			<div><dt class="font-medium text-base-content/70">Patient</dt><dd>{`${data.patient.firstName} ${data.patient.lastName}`.trim() || 'Not set'}</dd></div>
			<div><dt class="font-medium text-base-content/70">NHS number</dt><dd>{data.patient.nhsNumber || 'Not set'}</dd></div>
			<div><dt class="font-medium text-base-content/70">Body region</dt><dd>{bodyRegionLabel(data.request.bodyRegion)}</dd></div>
			<div><dt class="font-medium text-base-content/70">Indication</dt><dd>{indicationLabel(data.request.primaryIndication)}</dd></div>
			<div><dt class="font-medium text-base-content/70">Contrast</dt><dd>{contrastLabel(data.contrast.contrastRequired)}</dd></div>
			<div><dt class="font-medium text-base-content/70">Requested urgency</dt><dd>{data.triage.urgency || 'Not set'}</dd></div>
		</dl>
	</div>

	<Field label="Notes" inputId="notes">
		<TextAreaInput
			id="notes"
			label="Notes"
			rows={3}
			placeholder="Any additional notes for the vetting radiologist…"
			bind:value={data.triage.notes}
		/>
	</Field>
</Fieldset>
