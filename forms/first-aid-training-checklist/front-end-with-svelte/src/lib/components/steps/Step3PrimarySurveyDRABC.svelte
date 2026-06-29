<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TriStateField from '$lib/components/ui/TriStateField.svelte';

	const d = assessment.data.primarySurveyDRABC;
</script>

<Fieldset legend="Primary Survey (DRABC)">
	<p class="hint">Danger, Response, Airway, Breathing, Circulation — in order.</p>

	<TriStateField id="dangerCheck" label="D — checks for Danger to self, casualty, and bystanders." bind:value={d.dangerCheck} />
	<TriStateField id="responseCheck" label="R — assesses Response using AVPU / shake-and-shout." critical bind:value={d.responseCheck} />
	<TriStateField id="airwayManagement" label="A — opens and clears Airway with head tilt-chin lift (or jaw thrust)." bind:value={d.airwayManagement} />
	<TriStateField id="breathingCheck" label="B — checks Breathing (look, listen, feel) for up to 10 seconds." bind:value={d.breathingCheck} />
	<TriStateField id="circulationAssessment" label="C — assesses Circulation and obvious life-threatening bleeding." bind:value={d.circulationAssessment} />
	<TriStateField id="recoveryPositionWhenAppropriate" label="Places unconscious-but-breathing casualty in the recovery position." bind:value={d.recoveryPositionWhenAppropriate} />
</Fieldset>
