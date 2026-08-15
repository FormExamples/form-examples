<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import YesNoNA from '#lib/components/ui/YesNoNA.svelte';

	const d = assessment.data.electricalSafety;
</script>

<Fieldset legend="Electrical Safety">
	<p class="hint">PAT testing, fixed wiring, equipment condition, sockets and consumer unit.</p>

	<YesNoNA id="patTestingInDate" label="Portable Appliance Testing (PAT) is in date." bind:value={d.patTestingInDate} />
	<YesNoNA id="fixedWiringTestInDate" label="Fixed wiring electrical installation test is in date." bind:value={d.fixedWiringTestInDate} />
	<YesNoNA id="damagedEquipmentObserved" label="No damaged electrical equipment observed." bind:value={d.damagedEquipmentObserved} />
	<YesNoNA id="overloadedSocketsObserved" label="No overloaded sockets or daisy-chained extension leads." bind:value={d.overloadedSocketsObserved} />
	<YesNoNA id="extensionLeadsManagedSafely" label="Extension leads are managed safely (not trip hazards)." bind:value={d.extensionLeadsManagedSafely} />
	<YesNoNA id="consumerUnitAccessible" label="Consumer unit / distribution board is accessible and labelled." bind:value={d.consumerUnitAccessible} />

	<Field label="Observations" inputId="elecObservations">
		<TextAreaInput id="elecObservations" label="Observations" rows={3} placeholder="PAT label dates, EICR certificate location, etc.…" bind:value={d.observations} />
	</Field>
</Fieldset>
