<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import { TextInput } from "@lilydesignsystem/svelte-headless";
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 5 — Assessment context">
	<p class="hint">
		When the assessment was performed and in what setting. This records an assessor's examination
		findings; it does not diagnose, debride, or dress a wound.
	</p>

	<Field label="Date assessed" inputId="context-assessedAt">
		<TextInput
			id="context-assessedAt"
			label="Date assessed"
			type="date"
			class="date-input"
			bind:value={c.assessedAt}
		/>
	</Field>

	<Field label="Assessment setting" inputId="context-assessmentSetting">
		<Select id="context-assessmentSetting" label="Assessment setting" bind:value={c.assessmentSetting}>
			<option value="">— Select —</option>
			<option value="annual-review">Annual diabetes review</option>
			<option value="foot-protection-clinic">Foot protection clinic</option>
			<option value="hospital-admission">Hospital admission</option>
			<option value="pre-discharge">Pre-discharge check</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
