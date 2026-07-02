<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { computeSubscores } from '$lib/engine/pews-grader';
	import { subscoreColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const r = assessment.data.respiratory;
	const s = $derived(computeSubscores(assessment.data));
	const noAgeBand = $derived(assessment.data.identification.ageBand === '');

	function pill(points: number | null): string {
		return points === null ? 'Not recorded' : `${points} point${points === 1 ? '' : 's'}`;
	}
</script>

<Fieldset legend="Step 3 of 7 — Respiratory">
	<p class="hint">
		Respiratory rate is scored against the age-band normal range; effort, saturations, and oxygen
		are scored 0-3 independently of age.
	</p>

	{#if noAgeBand}
		<p class="hint">Select an age band in step 2 to score the respiratory rate.</p>
	{/if}

	<Field
		label="Respiratory rate (breaths/min)"
		description="Scored against the selected age band's normal range."
		inputId="respiratory-respiratoryRate"
	>
		<NumberInput
			id="respiratory-respiratoryRate"
			label="Respiratory rate"
			min={0}
			max={120}
			step={1}
			bind:value={r.respiratoryRate}
		/>
	</Field>

	<Field label="Respiratory rate subscore">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {subscoreColor(s.respiratoryRate)}"
		>
			{pill(s.respiratoryRate)}
		</span>
	</Field>

	<Field
		label="Respiratory effort / recession"
		description="None 0, mild 1, moderate 2, severe / grunting 3."
		inputId="respiratory-respiratoryEffort"
	>
		<Select
			id="respiratory-respiratoryEffort"
			label="Respiratory effort / recession"
			bind:value={r.respiratoryEffort}
		>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="mild">Mild recession</option>
			<option value="moderate">Moderate recession</option>
			<option value="severe">Severe recession / grunting</option>
		</Select>
	</Field>

	<Field
		label="Oxygen saturation (SpO2, %)"
		description="&ge; 96 scores 0, 94-95 scores 1, 92-93 scores 2, &lt; 92 scores 3."
		inputId="respiratory-oxygenSaturation"
	>
		<NumberInput
			id="respiratory-oxygenSaturation"
			label="Oxygen saturation"
			min={50}
			max={100}
			step={1}
			bind:value={r.oxygenSaturation}
		/>
	</Field>

	<Field label="Oxygen saturation subscore">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {subscoreColor(s.oxygenSaturation)}"
		>
			{pill(s.oxygenSaturation)}
		</span>
	</Field>

	<Field
		label="Supplemental oxygen"
		description="Room air 0, low-flow 1, high-flow / FiO2 &ge; 0.5 scores 3."
		inputId="respiratory-supplementalOxygen"
	>
		<Select
			id="respiratory-supplementalOxygen"
			label="Supplemental oxygen"
			bind:value={r.supplementalOxygen}
		>
			<option value="">— Select —</option>
			<option value="room-air">Room air</option>
			<option value="low-flow">Low-flow oxygen</option>
			<option value="high-flow">High-flow / FiO2 &ge; 0.5</option>
		</Select>
	</Field>
</Fieldset>
