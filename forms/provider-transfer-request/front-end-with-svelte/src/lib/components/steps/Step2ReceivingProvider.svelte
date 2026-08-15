<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import ProviderFields from '#lib/components/ProviderFields.svelte';

	const provider = assessment.data.receivingProvider;
</script>

<Fieldset legend="Receiving Provider Details">
	<p class="hint">
		The clinician or service being asked to take over care. Confirm acceptance before the patient
		leaves.
	</p>
	<ProviderFields {provider} idPrefix="receiving" />
</Fieldset>
