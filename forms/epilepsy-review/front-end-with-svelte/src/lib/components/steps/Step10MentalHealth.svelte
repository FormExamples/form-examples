<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const mh = assessment.data.mentalHealth;
</script>

<Fieldset legend="Step 10 of 11 — Mental health">
	<p class="hint">Mood, anxiety and depression screening, and any suicidality concern.</p>

	<Field
		label="Mental-health concern"
		description="Suicidality raises a high-priority flag; other concerns raise a medium flag."
		inputId="mentalHealth-mentalHealthConcern"
	>
		<Select
			id="mentalHealth-mentalHealthConcern"
			label="Mental-health concern"
			bind:value={mh.mentalHealthConcern}
		>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="low-mood">Low mood</option>
			<option value="anxiety">Anxiety</option>
			<option value="depression">Depression</option>
			<option value="suicidality">Suicidality</option>
		</Select>
	</Field>
</Fieldset>
