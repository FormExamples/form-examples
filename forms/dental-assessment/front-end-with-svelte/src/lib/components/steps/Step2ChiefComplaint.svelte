<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const c = assessment.data.chiefComplaint;
</script>

<Fieldset legend="Chief Complaint">
	<p class="hint">Primary dental concern and pain assessment.</p>

	<Field label="What is your primary dental concern?" inputId="primaryConcern">
		<TextAreaInput id="primaryConcern" label="Primary concern" rows={3} bind:value={c.primaryConcern} />
	</Field>

	<Field label="Pain location (if any)" inputId="painLocation">
		<TextInput id="painLocation" label="Pain location" bind:value={c.painLocation} />
	</Field>

	<Field label="Pain severity" inputId="painSeverity" description="0–10 scale">
		<NumberInput id="painSeverity" label="Pain severity" min={0} max={10} bind:value={c.painSeverity} />
	</Field>

	<Field label="When did the pain start?" inputId="painOnset">
		<TextInput id="painOnset" label="Pain onset" bind:value={c.painOnset} />
	</Field>

	<Field label="How long does the pain last?" inputId="painDuration">
		<TextInput id="painDuration" label="Pain duration" bind:value={c.painDuration} />
	</Field>
</Fieldset>
