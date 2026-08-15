<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import ProviderFields from '#lib/components/ProviderFields.svelte';

	const provider = assessment.data.requestingProvider;
</script>

<Fieldset legend="Requesting Provider Details">
	<p class="hint">
		The clinician initiating this transfer. Used by the receiving team for clarification and feedback.
	</p>
	<ProviderFields {provider} idPrefix="requesting" />
</Fieldset>
