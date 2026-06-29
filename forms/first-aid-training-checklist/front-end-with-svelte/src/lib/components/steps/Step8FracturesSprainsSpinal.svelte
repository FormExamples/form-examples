<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TriStateField from '$lib/components/ui/TriStateField.svelte';

	const d = assessment.data.fracturesSprainsSpinal;
</script>

<Fieldset legend="Fractures, Sprains & Spinal Injury">
	<p class="hint">Immobilise, support, and minimise movement of unstable injuries.</p>

	<TriStateField id="immobilisedInjuredLimb" label="Immobilises a suspected fracture in the position found." bind:value={d.immobilisedInjuredLimb} />
	<TriStateField id="appliedRiceForSprains" label="Applies RICE (Rest, Ice, Compression, Elevation) for sprains and strains." bind:value={d.appliedRiceForSprains} />
	<TriStateField id="suspectedSpinalManualSupport" label="Provides manual in-line head/neck support when spinal injury is suspected." bind:value={d.suspectedSpinalManualSupport} />
	<TriStateField id="performedLogRollWithTeam" label="Performs a coordinated log roll with team members where indicated." bind:value={d.performedLogRollWithTeam} />
	<TriStateField id="avoidedUnnecessaryMovement" label="Avoids unnecessary movement of suspected spinal or unstable fractures." bind:value={d.avoidedUnnecessaryMovement} />
</Fieldset>
