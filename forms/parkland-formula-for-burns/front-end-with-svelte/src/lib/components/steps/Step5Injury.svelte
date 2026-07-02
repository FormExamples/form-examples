<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateParkland } from '$lib/engine/parkland-grader';
	import { formatHours } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const i = assessment.data.injury;
	const grade = $derived(calculateParkland(assessment.data));
</script>

<Fieldset legend="Step 5 of 7 — Time of injury">
	<p class="hint">
		Calculation input 3 — the date and time the burn occurred. The first-8-h window is measured from
		injury, not from arrival, so the remaining window shrinks as time passes. When more than 8 h have
		elapsed the first phase is overdue.
	</p>

	<Field label="Date and time of injury" inputId="injury-injuryAt">
		<TextInput
			id="injury-injuryAt"
			label="Date and time of injury"
			type="datetime-local"
			class="date-input"
			bind:value={i.injuryAt}
		/>
	</Field>

	<Field label="Is the time of injury known or estimated?" inputId="injury-injuryTimeKnown">
		<Select id="injury-injuryTimeKnown" label="Time of injury known" bind:value={i.injuryTimeKnown}>
			<option value="">— Select —</option>
			<option value="known">Known</option>
			<option value="estimated">Estimated</option>
		</Select>
	</Field>

	<Field label="Hours elapsed since injury">
		<strong class="text-lg text-base-content">{formatHours(grade.hoursSinceInjury)}</strong>
		<span class="ml-2 text-sm text-base-content/70">
			({formatHours(grade.remainingFirst8hHours)} of the first 8 h remain)
		</span>
	</Field>
</Fieldset>
