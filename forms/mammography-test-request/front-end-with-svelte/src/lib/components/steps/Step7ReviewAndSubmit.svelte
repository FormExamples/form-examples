<script lang="ts">
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import { requestStore } from '#lib/stores/request.svelte.js';
	import { examTypeLabel, indicationLabel } from '#lib/engine/utils.js';

	const d = requestStore.data;
</script>

<Fieldset legend="7. Review and Submit">
	<p class="hint">
		Submit to compute the four-axis grade (appropriateness, cancer-pathway urgency, completeness,
		and clinical priority) and the safety flags. The vetting report opens on the next screen.
	</p>

	<dl class="mt-2 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
		<div>
			<dt class="font-medium text-base-content/70">Patient</dt>
			<dd>{d.patient.firstName} {d.patient.lastName}</dd>
		</div>
		<div>
			<dt class="font-medium text-base-content/70">Exam type</dt>
			<dd>{examTypeLabel(d.request.examType)}</dd>
		</div>
		<div>
			<dt class="font-medium text-base-content/70">Indication</dt>
			<dd>{indicationLabel(d.request.primaryIndication)}</dd>
		</div>
		<div>
			<dt class="font-medium text-base-content/70">Requesting clinician</dt>
			<dd>{d.clinician.clinicianName || '—'}</dd>
		</div>
	</dl>
</Fieldset>
