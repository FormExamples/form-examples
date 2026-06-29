<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TriStateField from '$lib/components/ui/TriStateField.svelte';

	const d = assessment.data.chokingManagement;
</script>

<Fieldset legend="Choking Management">
	<p class="hint">Escalate from coughing to back blows, abdominal thrusts, and CPR.</p>

	<TriStateField id="encouragedCoughing" label="Encourages an effective cough first when the airway is partially obstructed." bind:value={d.encouragedCoughing} />
	<TriStateField id="fiveBackBlows" label="Delivers up to 5 firm back blows between the shoulder blades." bind:value={d.fiveBackBlows} />
	<TriStateField id="fiveAbdominalThrusts" label="Delivers up to 5 abdominal thrusts (Heimlich) with correct hand position." bind:value={d.fiveAbdominalThrusts} />
	<TriStateField id="alternatesUntilDislodged" label="Alternates back blows and abdominal thrusts until obstruction is dislodged." bind:value={d.alternatesUntilDislodged} />
	<TriStateField id="unconsciousChokingCpr" label="Begins CPR immediately if the choking casualty becomes unconscious." critical bind:value={d.unconsciousChokingCpr} />
</Fieldset>
