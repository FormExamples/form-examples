<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.carer;
</script>

<Fieldset legend="Step 9 of 10 — Carer &amp; social">
	<p class="hint">
		Carer needs and the carer's own health, social circumstances, and day activity or employment.
	</p>

	<Field label="Carer needs" inputId="carer-carerNeedsStatus">
		<Select id="carer-carerNeedsStatus" label="Carer needs" bind:value={c.carerNeedsStatus}>
			<option value="">— Select —</option>
			<option value="assessed">Assessed</option>
			<option value="no-carer">No carer</option>
			<option value="not-assessed">Not assessed</option>
		</Select>
	</Field>

	<Field label="Social circumstances" inputId="carer-socialCircumstances">
		<TextAreaInput
			id="carer-socialCircumstances"
			label="Social circumstances"
			rows={3}
			placeholder="Housing, day activity, employment, relationships, and support."
			bind:value={c.socialCircumstances}
		/>
	</Field>
</Fieldset>
