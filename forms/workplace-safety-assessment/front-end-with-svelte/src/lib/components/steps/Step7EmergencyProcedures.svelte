<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import YesNoNA from '#lib/components/ui/YesNoNA.svelte';

	const d = assessment.data.emergencyProcedures;
</script>

<Fieldset legend="Emergency Procedures">
	<p class="hint">Evacuation, first-aid kits, first aiders, AED, contacts, drills.</p>

	<YesNoNA id="evacuationProcedurePosted" label="Evacuation procedure is posted prominently." bind:value={d.evacuationProcedurePosted} />
	<YesNoNA id="firstAidKitsStocked" label="First-aid kits are stocked and in date." bind:value={d.firstAidKitsStocked} />
	<YesNoNA id="firstAiderRosterCurrent" label="First-aider roster is current." bind:value={d.firstAiderRosterCurrent} />
	<YesNoNA id="aedAvailable" label="AED (defibrillator) available where required." bind:value={d.aedAvailable} />
	<YesNoNA id="aedServiceInDate" label="AED service / battery / pad checks are in date." bind:value={d.aedServiceInDate} />
	<YesNoNA id="emergencyContactsDisplayed" label="Emergency contact numbers are displayed." bind:value={d.emergencyContactsDisplayed} />
	<YesNoNA id="drillConductedLast12Months" label="A drill or live exercise has been conducted in the last 12 months." bind:value={d.drillConductedLast12Months} />

	<Field label="Observations" inputId="emergObservations">
		<TextAreaInput id="emergObservations" label="Observations" rows={3} placeholder="AED location, last drill report reference, etc.…" bind:value={d.observations} />
	</Field>
</Fieldset>
