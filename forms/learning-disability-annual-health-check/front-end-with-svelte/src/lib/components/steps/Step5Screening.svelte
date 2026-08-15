<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const s = assessment.data.screening;
</script>

<Fieldset legend="Step 5 of 10 — Health screening &amp; immunisations">
	<p class="hint">Uptake of eligible national screening and routine immunisations.</p>

	<Field
		label="Cancer screening (bowel / breast / cervical)"
		inputId="screening-cancerScreeningStatus"
	>
		<Select
			id="screening-cancerScreeningStatus"
			label="Cancer screening (bowel / breast / cervical)"
			bind:value={s.cancerScreeningStatus}
		>
			<option value="">— Select —</option>
			<option value="up-to-date">Up to date</option>
			<option value="declined">Declined (with reason)</option>
			<option value="not-eligible">Not eligible</option>
			<option value="not-recorded">Not recorded</option>
		</Select>
	</Field>

	<Field label="Other screening" inputId="screening-otherScreeningStatus">
		<Select
			id="screening-otherScreeningStatus"
			label="Other screening"
			bind:value={s.otherScreeningStatus}
		>
			<option value="">— Select —</option>
			<option value="up-to-date">Up to date</option>
			<option value="declined">Declined (with reason)</option>
			<option value="not-eligible">Not eligible</option>
			<option value="not-recorded">Not recorded</option>
		</Select>
	</Field>

	<Field
		label="Immunisations (seasonal and routine)"
		inputId="screening-immunisationStatus"
	>
		<Select
			id="screening-immunisationStatus"
			label="Immunisations (seasonal and routine)"
			bind:value={s.immunisationStatus}
		>
			<option value="">— Select —</option>
			<option value="up-to-date">Up to date</option>
			<option value="declined">Declined (with reason)</option>
			<option value="not-recorded">Not recorded</option>
		</Select>
	</Field>
</Fieldset>
