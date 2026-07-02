<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.symptoms;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 5 of 6 — Symptoms">
	<p class="hint">
		Symptoms attributable to the calcium result support the symptomatic-hypercalcaemia flag when the
		corrected calcium is above 2.60 mmol/L.
	</p>

	<Field label="Is the patient symptomatic (e.g. polyuria, confusion, arrhythmia, tetany)?">
		<RadioGroup label="Is the patient symptomatic?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="symptoms-symptomatic"
						value={opt.value}
						bind:group={s.symptomatic}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
