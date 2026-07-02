<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.comorbidityStep;
	const options = [
		{ value: 'none', label: 'No major comorbidity — 0 points' },
		{
			value: 'major',
			label: 'Cardiac failure, ischaemic heart disease, or any major comorbidity — 2 points'
		},
		{
			value: 'severe',
			label: 'Renal failure, liver failure, or disseminated malignancy — 3 points'
		}
	];
</script>

<Fieldset legend="Step 4 of 6 — Comorbidity">
	<p class="hint">Clinical parameter — the patient's most severe relevant comorbidity.</p>

	<Field label="Comorbidity">
		<RadioGroup label="Comorbidity">
			{#each options as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="comorbidity"
						value={opt.value}
						bind:group={c.comorbidity}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
