<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateFourATGrade } from '#lib/engine/fourat-grader.js';
	import { pointColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const i = assessment.data.item4;
	const point = $derived(calculateFourATGrade(assessment.data).item4Score);
	const yesNo = [
		{ value: 'no', label: 'No' },
		{ value: 'yes', label: 'Yes' }
	];
</script>

<Fieldset legend="Step 5 of 6 — Item 4: Acute change or fluctuating course">
	<p class="hint">
		Evidence of significant change or fluctuation in alertness, cognition, or other mental function
		arising over the last 2 weeks and still evident in the last 24 hours. A positive answer scores 4
		points.
	</p>

	<Field label="Acute change or fluctuating course present?">
		<RadioGroup label="Acute change or fluctuating course present?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="item4-acuteChange"
						value={opt.value}
						bind:group={i.acuteChange}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field
		label="Information source"
		description="Where the acute-change information came from. Record 'None available' when it could not be reliably established."
		inputId="item4-acuteChangeSource"
	>
		<Select id="item4-acuteChangeSource" label="Information source" bind:value={i.acuteChangeSource}>
			<option value="">— Select —</option>
			<option value="patient">Patient</option>
			<option value="collateral">Collateral history</option>
			<option value="records">Records</option>
			<option value="none">None available</option>
		</Select>
	</Field>

	<Field label="Item 4 score">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} of 4
		</span>
	</Field>
</Fieldset>
