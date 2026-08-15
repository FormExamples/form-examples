<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TriStateField from '#lib/components/ui/TriStateField.svelte';

	const s = assessment.data.spinalInjuryManagement;
</script>

<Fieldset legend="Spinal Injury Management">
	<p class="hint">Head-splint hold and correct spineboard use are critical competencies.</p>

	<TriStateField label="Recognises mechanism of injury suggesting suspected spinal trauma" name="recognisesMechanism" bind:value={s.recognisesMechanism} />
	<TriStateField label="Applies head-splint hold safely in the water" name="headSplintHold" critical bind:value={s.headSplintHold} />
	<TriStateField label="Maintains in-line stabilisation throughout movement" name="maintainsInlineStabilisation" bind:value={s.maintainsInlineStabilisation} />
	<TriStateField label="Performs careful in-water roll if face-down (where indicated)" name="carefulRollIfNeeded" bind:value={s.carefulRollIfNeeded} />
	<TriStateField label="Uses spineboard correctly to extricate suspected spinal casualty" name="useOfSpineboard" critical bind:value={s.useOfSpineboard} />
	<TriStateField label="Secures casualty to spineboard with straps and head blocks" name="secureCasualtyToBoard" bind:value={s.secureCasualtyToBoard} />
</Fieldset>
