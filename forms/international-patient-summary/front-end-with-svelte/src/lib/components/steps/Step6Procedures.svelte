<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import ProcedureEntry from '$lib/components/ui/ProcedureEntry.svelte';

	const d = assessment.data;
</script>

<Fieldset legend="Procedures">
	<p class="hint">Significant past procedures and operations relevant to ongoing care.</p>
	<ProcedureEntry bind:procedures={d.procedures} />
</Fieldset>
