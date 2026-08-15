<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TriStateField from '#lib/components/ui/TriStateField.svelte';

	const s = assessment.data.supervisionScanningZoning;
</script>

<Fieldset legend="Supervision, Scanning & Zoning">
	<p class="hint">Effective scanning across the zone is a critical competency.</p>

	<TriStateField label="Understands and articulates zone of responsibility" name="understandsZoneOfResponsibility" bind:value={s.understandsZoneOfResponsibility} />
	<TriStateField label="Maintains an effective, systematic scanning pattern" name="effectiveScanningPattern" critical bind:value={s.effectiveScanningPattern} />
	<TriStateField label="Applies the 10/20 rule (10 s to recognise, 20 s to reach)" name="tenTwentyScanRule" bind:value={s.tenTwentyScanRule} />
	<TriStateField label="Recognises early signs of a distressed or drowning swimmer" name="recognisesDistressedSwimmer" bind:value={s.recognisesDistressedSwimmer} />
	<TriStateField label="Performs zone rotations safely and at appropriate intervals" name="appropriateRotation" bind:value={s.appropriateRotation} />
	<TriStateField label="Uses whistle and hand signals correctly" name="usesWhistleAndSignals" bind:value={s.usesWhistleAndSignals} />
</Fieldset>
