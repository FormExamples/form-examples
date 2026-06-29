<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TriStateField from '$lib/components/ui/TriStateField.svelte';

	const r = assessment.data.rescueUnconscious;
</script>

<Fieldset legend="Rescue Scenario — Unconscious Casualty">
	<p class="hint">Effective tow and safe extrication of an unconscious casualty are critical competencies.</p>

	<TriStateField label="Recognises unconscious casualty and activates emergency response" name="ruRecognitionAndAlert" bind:value={r.recognitionAndAlert} />
	<TriStateField label="Performs safe entry and rapid approach to the casualty" name="safeEntryAndApproach" bind:value={r.safeEntryAndApproach} />
	<TriStateField label="Manages the airway in the water (head tilt, mouth clear)" name="airwayManagementInWater" bind:value={r.airwayManagementInWater} />
	<TriStateField label="Effective tow of unconscious casualty to safety, airway protected" name="effectiveTowToSafety" critical bind:value={r.effectiveTowToSafety} />
	<TriStateField label="Safe extrication of unconscious casualty without injury" name="safeExtrication" critical bind:value={r.safeExtrication} />
	<TriStateField label="Communicates clear handover signal to colleagues / EMS" name="handoverHandsignal" bind:value={r.handoverHandsignal} />
</Fieldset>
