<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';

	const dth = assessment.data.death;
</script>

<Fieldset legend="Step 3 of 6 — Death details">
	<p class="hint">When and where death occurred, and who saw the deceased after death.</p>

	<Field label="Date of death" inputId="death-dateOfDeath">
		<DateInput id="death-dateOfDeath" label="Date of death" bind:value={dth.dateOfDeath} />
	</Field>

	<Field label="Time of death" inputId="death-timeOfDeath">
		<DateInput
			id="death-timeOfDeath"
			label="Time of death"
			type="time"
			bind:value={dth.timeOfDeath}
		/>
	</Field>

	<Field label="Place of death" inputId="death-placeOfDeath">
		<TextInput
			id="death-placeOfDeath"
			label="Place of death"
			placeholder="Ward, home, hospice, or other"
			bind:value={dth.placeOfDeath}
		/>
	</Field>

	<Field label="Seen after death by" inputId="death-seenAfterDeathBy">
		<Select id="death-seenAfterDeathBy" label="Seen after death by" bind:value={dth.seenAfterDeathBy}>
			<option value="">— Select —</option>
			<option value="certifier">By the certifying doctor</option>
			<option value="another-practitioner">By another practitioner</option>
			<option value="not-seen">Not seen after death</option>
		</Select>
	</Field>
</Fieldset>
