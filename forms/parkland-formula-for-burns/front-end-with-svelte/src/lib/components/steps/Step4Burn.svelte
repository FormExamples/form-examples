<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateParkland } from '#lib/engine/parkland-grader.js';
	import { formatVolume } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const b = assessment.data.burn;
	const grade = $derived(calculateParkland(assessment.data));
</script>

<Fieldset legend="Step 4 of 7 — Burn extent">
	<p class="hint">
		Calculation input 2 — the percentage total body-surface area (%TBSA) that is partial-thickness
		or deeper. Superficial (epidermal) burns are excluded. Total 24 h volume = 4 × weight × %TBSA.
	</p>

	<Field
		label="%TBSA burned (partial-thickness or deeper)"
		description="Enter a value between 0 and 100. Superficial erythema is not counted."
		inputId="burn-tbsaPercent"
	>
		<NumberInput
			id="burn-tbsaPercent"
			label="%TBSA burned"
			min={0}
			max={100}
			step={1}
			bind:value={b.tbsaPercent}
		/>
	</Field>

	<Field label="Estimation method" inputId="burn-tbsaMethod">
		<Select id="burn-tbsaMethod" label="Estimation method" bind:value={b.tbsaMethod}>
			<option value="">— Select —</option>
			<option value="rule-of-nines">Wallace Rule of Nines</option>
			<option value="lund-browder">Lund-Browder chart</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Live total 24 h volume">
		<strong class="text-lg text-base-content">{formatVolume(grade.total24hVolumeMl)}</strong>
	</Field>
</Fieldset>
