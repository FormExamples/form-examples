<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import MedicationEntry from '#lib/components/ui/MedicationEntry.svelte';
</script>

<Fieldset legend="Current Medications">
	<p class="hint">List all medications you currently take, including stimulants, non-stimulants, antidepressants, anxiolytics, and supplements.</p>
	<Field label="Medications">
		<MedicationEntry bind:medications={assessment.data.medications} />
	</Field>
</Fieldset>
