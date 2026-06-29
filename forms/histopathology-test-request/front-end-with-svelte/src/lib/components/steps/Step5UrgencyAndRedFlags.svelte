<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/result.svelte';

	const d = request.data.urgency;
</script>

<Fieldset legend="5. Urgency and Red Flags">
	<p class="hint">A frozen section or two-week-wait pathway auto-escalates the triage tier.</p>

	<Field label="Urgent intra-operative frozen section (immediate)" inputId="urgentFrozenSection">
		<CheckboxInput
			id="urgentFrozenSection"
			label="Urgent intra-operative frozen section (immediate)"
			bind:checked={d.urgentFrozenSection}
		/>
	</Field>

	<Field label="Suspected-cancer two-week-wait (2WW) pathway" inputId="twoWeekWait">
		<CheckboxInput
			id="twoWeekWait"
			label="Suspected-cancer two-week-wait (2WW) pathway"
			bind:checked={d.twoWeekWait}
		/>
	</Field>

	<Field label="Requested urgency" inputId="urgency" required>
		<Select id="urgency" label="Requested urgency" bind:value={d.urgency} required>
			<option value="">Select…</option>
			<option value="routine">Routine</option>
			<option value="urgent">Urgent</option>
			<option value="two-week-wait">Two-week-wait (suspected cancer)</option>
		</Select>
	</Field>
</Fieldset>
