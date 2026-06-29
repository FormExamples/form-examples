<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import DiagnosisEntry from '$lib/components/ui/DiagnosisEntry.svelte';

	const d = assessment.data.diagnoses;
</script>

<Fieldset legend="Diagnoses">
	<p class="hint">
		List at least one primary diagnosis, ideally coded with ICD-10. Add secondary diagnoses as
		needed.
	</p>
	<DiagnosisEntry bind:diagnoses={d.diagnoses} />
</Fieldset>
