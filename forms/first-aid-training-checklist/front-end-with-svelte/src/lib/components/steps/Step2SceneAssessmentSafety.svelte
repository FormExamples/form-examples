<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TriStateField from '$lib/components/ui/TriStateField.svelte';

	const d = assessment.data.sceneAssessmentSafety;
</script>

<Fieldset legend="Scene Assessment & Safety">
	<p class="hint">Approach, protect, and control the scene before treating the casualty.</p>

	<TriStateField id="sceneSafe" label="Confirms the scene is safe before approaching the casualty." bind:value={d.sceneSafe} />
	<TriStateField id="ppeApplied" label="Applies appropriate PPE (gloves, face shield)." bind:value={d.ppeApplied} />
	<TriStateField id="hazardsIdentified" label="Identifies and mitigates environmental hazards (traffic, electricity, chemicals)." bind:value={d.hazardsIdentified} />
	<TriStateField id="bystandersControlled" label="Manages bystanders so they do not impede care or compromise safety." bind:value={d.bystandersControlled} />
</Fieldset>
