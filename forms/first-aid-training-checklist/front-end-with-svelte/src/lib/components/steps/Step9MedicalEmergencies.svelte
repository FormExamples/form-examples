<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TriStateField from '$lib/components/ui/TriStateField.svelte';

	const d = assessment.data.medicalEmergencies;
</script>

<Fieldset legend="Medical Emergencies">
	<p class="hint">Recognise and manage anaphylaxis, asthma, hypoglycaemia, seizure, stroke, and cardiac events.</p>

	<TriStateField id="recognisedAnaphylaxis" label="Recognises anaphylaxis (airway / breathing / circulation symptoms)." critical bind:value={d.recognisedAnaphylaxis} />
	<TriStateField id="administeredEpiPenSafely" label="Administers an EpiPen / adrenaline auto-injector safely into the outer thigh." bind:value={d.administeredEpiPenSafely} />
	<TriStateField id="assistedAsthmaInhaler" label="Assists casualty with a reliever inhaler during an asthma attack." bind:value={d.assistedAsthmaInhaler} />
	<TriStateField id="managedHypoglycaemia" label="Manages hypoglycaemia with sugary drink / glucose if conscious." bind:value={d.managedHypoglycaemia} />
	<TriStateField id="managedSeizureSafely" label="Manages a seizure: protect head, time the seizure, recovery position after." bind:value={d.managedSeizureSafely} />
	<TriStateField id="recognisedStrokeFAST" label="Recognises stroke using FAST (Face, Arms, Speech, Time)." bind:value={d.recognisedStrokeFAST} />
	<TriStateField id="recognisedChestPain" label="Recognises chest pain / suspected MI and provides appropriate care." bind:value={d.recognisedChestPain} />
</Fieldset>
