<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const s = assessment.data.smoking;
</script>

<Fieldset legend="Step 6 of 11 — Smoking status and cessation">
	<p class="hint">Smoking is the leading modifiable risk factor in COPD.</p>

	<Field label="Smoking status" required inputId="smoking-smokingStatus">
		<Select id="smoking-smokingStatus" label="Smoking status" required bind:value={s.smokingStatus}>
			<option value="">— Select —</option>
			<option value="current">Current smoker</option>
			<option value="ex">Ex-smoker</option>
			<option value="never">Never smoked</option>
		</Select>
	</Field>

	<Field label="Pack-years" inputId="smoking-packYears">
		<NumberInput
			id="smoking-packYears"
			label="Pack-years"
			min={0}
			max={200}
			step={0.1}
			bind:value={s.packYears}
		/>
	</Field>

	<Field
		label="Cessation support offered (brief advice / referral)?"
		inputId="smoking-cessationSupportOffered"
	>
		<Select
			id="smoking-cessationSupportOffered"
			label="Cessation support offered"
			bind:value={s.cessationSupportOffered}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
