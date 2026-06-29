<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import ImmunisationEntry from '$lib/components/ui/ImmunisationEntry.svelte';

	const d = assessment.data;
</script>

<Fieldset legend="Immunisations">
	<p class="hint">Vaccinations administered. Required for cross-border occupational and travel care.</p>
	<ImmunisationEntry bind:immunisations={d.immunisations} />
</Fieldset>
