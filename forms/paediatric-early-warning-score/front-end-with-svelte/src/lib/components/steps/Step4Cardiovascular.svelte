<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { computeSubscores } from '$lib/engine/pews-grader';
	import { subscoreColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const cv = assessment.data.cardiovascular;
	const s = $derived(computeSubscores(assessment.data));
	const noAgeBand = $derived(assessment.data.identification.ageBand === '');

	function pill(points: number | null): string {
		return points === null ? 'Not recorded' : `${points} point${points === 1 ? '' : 's'}`;
	}
</script>

<Fieldset legend="Step 4 of 7 — Cardiovascular">
	<p class="hint">
		Heart rate is scored against the age-band normal range; capillary refill / colour is scored
		0-3 independently of age.
	</p>

	{#if noAgeBand}
		<p class="hint">Select an age band in step 2 to score the heart rate.</p>
	{/if}

	<Field
		label="Heart rate (beats/min)"
		description="Scored against the selected age band's normal range."
		inputId="cardiovascular-heartRate"
	>
		<NumberInput
			id="cardiovascular-heartRate"
			label="Heart rate"
			min={0}
			max={260}
			step={1}
			bind:value={cv.heartRate}
		/>
	</Field>

	<Field label="Heart rate subscore">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {subscoreColor(s.heartRate)}"
		>
			{pill(s.heartRate)}
		</span>
	</Field>

	<Field
		label="Capillary refill / colour"
		description="&lt; 2 s pink 0, 2-3 s scores 1, 3-4 s pale scores 2, &gt; 4 s mottled / cyanosed scores 3."
		inputId="cardiovascular-capillaryRefill"
	>
		<Select
			id="cardiovascular-capillaryRefill"
			label="Capillary refill / colour"
			bind:value={cv.capillaryRefill}
		>
			<option value="">— Select —</option>
			<option value="under-2s">&lt; 2 s, pink</option>
			<option value="2-3s">2-3 s</option>
			<option value="3-4s">3-4 s, pale</option>
			<option value="over-4s">&gt; 4 s, mottled / cyanosed</option>
		</Select>
	</Field>

	<Field label="Capillary refill subscore">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {subscoreColor(s.capillaryRefill)}"
		>
			{pill(s.capillaryRefill)}
		</span>
	</Field>
</Fieldset>
