<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const e = assessment.data.environmentalFactors;
</script>

<Fieldset legend="Environmental Factors">
	<p class="hint">Describe the environments where you live, work, and participate in the community.</p>

	<Field label="Home Environment" inputId="homeEnvironment">
		<TextAreaInput id="homeEnvironment" label="Home Environment" rows={3} placeholder="Describe your home setup, accessibility, any barriers or hazards..." bind:value={e.homeEnvironment} />
	</Field>

	<Field label="Work/School Environment" inputId="workEnvironment">
		<TextAreaInput id="workEnvironment" label="Work/School Environment" rows={3} placeholder="Describe your workplace/school setup, accessibility, ergonomics..." bind:value={e.workEnvironment} />
	</Field>

	<Field label="Community Access" inputId="communityAccess">
		<TextAreaInput id="communityAccess" label="Community Access" rows={3} placeholder="Describe your access to community resources, transportation, shops, healthcare..." bind:value={e.communityAccess} />
	</Field>

	<Field label="Assistive Devices" inputId="assistiveDevices">
		<TextAreaInput id="assistiveDevices" label="Assistive Devices" rows={3} placeholder="List any assistive devices currently used or needed..." bind:value={e.assistiveDevices} />
	</Field>

	<Field label="Social Support" inputId="socialSupport">
		<TextAreaInput id="socialSupport" label="Social Support" rows={3} placeholder="Describe available social support..." bind:value={e.socialSupport} />
	</Field>
</Fieldset>
