<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TriStateField from '#lib/components/ui/TriStateField.svelte';

	const d = assessment.data.cprAed;
</script>

<Fieldset legend="CPR & AED">
	<p class="hint">High-quality CPR and safe automated external defibrillator use.</p>

	<TriStateField id="effectiveCompressions" label="Delivers effective chest compressions at 100-120/min, 5-6 cm depth." critical bind:value={d.effectiveCompressions} />
	<TriStateField id="effectiveVentilations" label="Delivers effective rescue breaths producing visible chest rise." critical bind:value={d.effectiveVentilations} />
	<TriStateField id="ratio30to2" label="Maintains a 30:2 compression-to-ventilation ratio." bind:value={d.ratio30to2} />
	<TriStateField id="aedPowerOnPromptly" label="Powers on the AED as soon as it is available and follows voice prompts." bind:value={d.aedPowerOnPromptly} />
	<TriStateField id="aedPadPlacement" label="Places AED pads in correct anterolateral position on bare chest." bind:value={d.aedPadPlacement} />
	<TriStateField id="aedSafeShockDelivery" label="Delivers shock safely with verbal 'stand clear' — no unsafe contact." critical bind:value={d.aedSafeShockDelivery} />
</Fieldset>
