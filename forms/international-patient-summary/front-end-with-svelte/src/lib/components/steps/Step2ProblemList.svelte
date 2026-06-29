<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import ProblemEntry from '$lib/components/ui/ProblemEntry.svelte';

	const d = assessment.data;
</script>

<Fieldset legend="Problem List">
	<p class="hint">Active and past problems. Use ICD-10 (or SNOMED CT) coding where possible.</p>
	<ProblemEntry bind:problems={d.problemList} />
</Fieldset>
