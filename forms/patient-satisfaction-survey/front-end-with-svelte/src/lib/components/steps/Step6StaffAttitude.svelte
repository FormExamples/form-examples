<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import LikertField from '#lib/components/ui/LikertField.svelte';

	const d = assessment.data.staffAttitude;
</script>

<Fieldset legend="Staff Attitude & Professionalism">
	<p class="hint">How were you treated by staff?</p>

	<LikertField label="Doctor courtesy" name="doctorCourtesy" bind:value={d.doctorCourtesy} />
	<LikertField label="Nurse courtesy" name="nurseCourtesy" bind:value={d.nurseCourtesy} />
	<LikertField label="Reception courtesy" name="receptionCourtesy" bind:value={d.receptionCourtesy} />
	<LikertField label="Respect for your dignity" name="respectForDignity" bind:value={d.respectForDignity} />
	<LikertField label="Cultural sensitivity" name="culturalSensitivity" bind:value={d.culturalSensitivity} />
	<LikertField label="Emotional support" name="emotionalSupport" bind:value={d.emotionalSupport} />
</Fieldset>
