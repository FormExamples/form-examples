<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TriStateField from '$lib/components/ui/TriStateField.svelte';

	const d = assessment.data.primarySurvey;
</script>

<Fieldset legend="Primary Survey">
	<p class="hint">Rapid assessment and management of immediate life threats.</p>

	<TriStateField
		label="Verbalizes a general impression of the patient."
		name="generalImpression"
		bind:value={d.generalImpression}
	/>
	<TriStateField
		label="Determines responsiveness / level of consciousness (AVPU)."
		name="mentalStatus"
		bind:value={d.mentalStatus}
	/>
	<TriStateField
		label="Assesses airway and initiates appropriate airway management."
		name="airway"
		critical
		bind:value={d.airway}
	/>
	<TriStateField
		label="Assesses breathing and initiates appropriate ventilatory support."
		name="breathing"
		critical
		bind:value={d.breathing}
	/>
	<TriStateField
		label="Provides appropriate oxygen therapy when indicated."
		name="oxygenTherapy"
		critical
		bind:value={d.oxygenTherapy}
	/>
	<TriStateField
		label="Assesses circulation, controls major bleeding, and manages shock."
		name="circulation"
		critical
		bind:value={d.circulation}
	/>
	<TriStateField
		label="Identifies patient priority and makes a transport urgency decision."
		name="transportPriority"
		critical
		bind:value={d.transportPriority}
	/>
</Fieldset>
