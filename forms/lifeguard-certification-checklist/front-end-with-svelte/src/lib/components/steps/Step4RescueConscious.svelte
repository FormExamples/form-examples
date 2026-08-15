<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TriStateField from '#lib/components/ui/TriStateField.svelte';

	const r = assessment.data.rescueConscious;
</script>

<Fieldset legend="Rescue Scenario — Conscious Casualty">
	<p class="hint">Rescue of a conscious casualty using an approved floating aid.</p>

	<TriStateField label="Recognises the incident and alerts the team without delay" name="rcRecognitionAndAlert" bind:value={r.recognitionAndAlert} />
	<TriStateField label="Enters the water without losing sight of the casualty" name="entryWithoutLossOfSight" bind:value={r.entryWithoutLossOfSight} />
	<TriStateField label="Approaches with a floating aid (torpedo buoy, throw bag)" name="approachWithFloatingAid" bind:value={r.approachWithFloatingAid} />
	<TriStateField label="Reassures and instructs the casualty during the rescue" name="reassuresCasualty" bind:value={r.reassuresCasualty} />
	<TriStateField label="Tows the casualty safely to the side / shore" name="rcTowToSafety" bind:value={r.towToSafety} />
	<TriStateField label="Extricates the casualty from the water with appropriate technique" name="extricationFromWater" bind:value={r.extricationFromWater} />
</Fieldset>
