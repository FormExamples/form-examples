<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TriStateField from '#lib/components/ui/TriStateField.svelte';

	const d = assessment.data.bleedingWoundCare;
</script>

<Fieldset legend="Bleeding & Wound Care">
	<p class="hint">Control catastrophic haemorrhage first, then dress and treat for shock.</p>

	<TriStateField id="directPressureApplied" label="Applies firm direct pressure to control major external bleeding." critical bind:value={d.directPressureApplied} />
	<TriStateField id="elevatedAndImmobilised" label="Elevates and immobilises the injured part where appropriate." bind:value={d.elevatedAndImmobilised} />
	<TriStateField id="appliedDressingCorrectly" label="Applies a sterile dressing and bandage with appropriate pressure." bind:value={d.appliedDressingCorrectly} />
	<TriStateField id="tourniquetWhenIndicated" label="Applies a tourniquet correctly for catastrophic limb haemorrhage when indicated." critical bind:value={d.tourniquetWhenIndicated} />
	<TriStateField id="haemostaticDressingApplied" label="Applies haemostatic dressing / wound packing for junctional haemorrhage." bind:value={d.haemostaticDressingApplied} />
	<TriStateField id="treatedForShock" label="Treats casualty for shock (lay flat, raise legs, keep warm)." bind:value={d.treatedForShock} />
</Fieldset>
