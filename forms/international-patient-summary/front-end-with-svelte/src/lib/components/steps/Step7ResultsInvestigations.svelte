<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import ResultEntry from '$lib/components/ui/ResultEntry.svelte';

	const d = assessment.data;
</script>

<Fieldset legend="Results & Investigations">
	<p class="hint">Recent diagnostic results and investigations relevant to ongoing care.</p>
	<ResultEntry bind:results={d.resultsInvestigations} />
</Fieldset>
