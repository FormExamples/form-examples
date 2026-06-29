<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TriStateField from '$lib/components/ui/TriStateField.svelte';

	const d = assessment.data.burnsScalds;
</script>

<Fieldset legend="Burns & Scalds">
	<p class="hint">Cool, cover, and refer — avoid harmful folk remedies.</p>

	<TriStateField id="cooledForTwentyMinutes" label="Cools the burn with running cool water for at least 20 minutes." bind:value={d.cooledForTwentyMinutes} />
	<TriStateField id="removedJewelleryAndLooseClothing" label="Removes jewellery and loose clothing before swelling — but not stuck items." bind:value={d.removedJewelleryAndLooseClothing} />
	<TriStateField id="coveredWithClingFilmOrSterileDressing" label="Covers the burn loosely with cling film or a sterile non-adherent dressing." bind:value={d.coveredWithClingFilmOrSterileDressing} />
	<TriStateField id="avoidedCreamsOrIce" label="Avoids applying creams, butter, ice, or bursting blisters." bind:value={d.avoidedCreamsOrIce} />
	<TriStateField id="referredAppropriately" label="Refers serious burns to hospital (size, depth, age, location criteria)." bind:value={d.referredAppropriately} />
</Fieldset>
