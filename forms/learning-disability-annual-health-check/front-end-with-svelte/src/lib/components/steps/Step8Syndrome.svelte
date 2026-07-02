<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const s = assessment.data.syndrome;
</script>

<Fieldset legend="Step 8 of 10 — Syndrome-specific checks">
	<p class="hint">
		Condition-specific checks relevant to the person (for example Down syndrome thyroid, vision and
		hearing).
	</p>

	<Field label="Syndrome-specific health checks" inputId="syndrome-syndromeSpecificStatus">
		<Select
			id="syndrome-syndromeSpecificStatus"
			label="Syndrome-specific health checks"
			bind:value={s.syndromeSpecificStatus}
		>
			<option value="">— Select —</option>
			<option value="done">Done</option>
			<option value="not-applicable">Not applicable</option>
			<option value="not-done">Not done</option>
		</Select>
	</Field>
</Fieldset>
