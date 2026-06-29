<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TriStateField from '$lib/components/ui/TriStateField.svelte';

	const f = assessment.data.firstAidOxygen;
</script>

<Fieldset legend="First Aid & Oxygen Therapy">
	<p class="hint">Core first-aid skills and oxygen administration.</p>

	<TriStateField label="Controls external bleeding (pressure, dressings, elevation)" name="bleedingControl" bind:value={f.bleedingControl} />
	<TriStateField label="Manages burns appropriately (cool water, cover)" name="burnsManagement" bind:value={f.burnsManagement} />
	<TriStateField label="Immobilises suspected fractures and supports the limb" name="fractureImmobilisation" bind:value={f.fractureImmobilisation} />
	<TriStateField label="Places unresponsive breathing casualty in the recovery position" name="recoveryPositionUse" bind:value={f.recoveryPositionUse} />
	<TriStateField label="Administers oxygen therapy correctly via mask at appropriate flow" name="oxygenTherapyAdministration" bind:value={f.oxygenTherapyAdministration} />
	<TriStateField label="Uses pocket mask or bag-valve-mask with effective seal" name="usesPocketMaskOrBVM" bind:value={f.usesPocketMaskOrBVM} />
</Fieldset>
