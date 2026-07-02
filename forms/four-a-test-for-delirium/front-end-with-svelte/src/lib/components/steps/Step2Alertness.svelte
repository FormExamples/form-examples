<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateFourATGrade } from '$lib/engine/fourat-grader';
	import { pointColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const i = assessment.data.item1;
	const point = $derived(calculateFourATGrade(assessment.data).item1Score);
	const options = [
		{ value: 'normal', label: 'Normal — fully alert, not agitated, throughout' },
		{ value: 'mildTransient', label: 'Mild sleepiness under 10 seconds after waking, then normal' },
		{ value: 'abnormal', label: 'Clearly abnormal — markedly drowsy, or agitated / hyperactive' }
	];
</script>

<Fieldset legend="Step 2 of 6 — Item 1: Alertness">
	<p class="hint">
		Observe the patient. If asleep, attempt to wake with speech or gentle touch. Clearly abnormal
		alertness scores 4 points; normal or mild transient sleepiness scores 0.
	</p>

	<Field label="Observed alertness">
		<RadioGroup label="Observed alertness">
			{#each options as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="item1-alertness"
						value={opt.value}
						bind:group={i.alertness}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Item 1 score">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(point)}">
			{point} of 4
		</span>
	</Field>
</Fieldset>
