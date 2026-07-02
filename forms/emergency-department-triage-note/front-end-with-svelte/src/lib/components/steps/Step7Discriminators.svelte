<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import type { Discriminators } from '$lib/engine/types';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.discriminators;

	const items: { field: keyof Discriminators; label: string }[] = [
		{ field: 'airwayThreat', label: 'Airway — threatened or compromised airway? (Immediate)' },
		{
			field: 'breathingInadequate',
			label: 'Breathing — severely inadequate breathing / respiratory failure? (Immediate)'
		},
		{ field: 'circulationShock', label: 'Circulation — shock or circulatory compromise? (Immediate)' },
		{
			field: 'haemorrhageMajor',
			label: 'Circulation — major or catastrophic haemorrhage? (Immediate)'
		},
		{ field: 'seizureActive', label: 'Disability — active seizure? (Immediate)' },
		{
			field: 'consciousnessReduced',
			label: 'Disability — reduced consciousness (voice / pain)? (Very urgent)'
		},
		{ field: 'focalNeurology', label: 'Disability — acute focal neurological deficit? (Very urgent)' },
		{
			field: 'strokeFeatures',
			label: 'Disability — features of acute stroke? (Very urgent, time-critical)'
		},
		{
			field: 'chestPainCardiac',
			label: 'Circulation — chest pain of possible cardiac origin? (Very urgent, time-critical)'
		},
		{ field: 'sepsisFeatures', label: 'Temperature — features suggestive of sepsis? (Very urgent)' },
		{
			field: 'paediatricRedFlag',
			label: 'Disability — paediatric red flag? (Very urgent, time-critical)'
		}
	];
</script>

<Fieldset legend="Step 7 of 8 — Discriminators">
	<p class="hint">
		Manchester Triage System general discriminators. Any "Yes" forces at least the level shown; the
		most urgent wins.
	</p>

	{#each items as item (item.field)}
		<Field label={item.label}>
			<RadioGroup label={item.label}>
				<label>
					<input
						type="radio"
						class="radio-input"
						name={`discriminators-${item.field}`}
						value="yes"
						bind:group={d[item.field]}
					/>
					Yes
				</label>
				<label>
					<input
						type="radio"
						class="radio-input"
						name={`discriminators-${item.field}`}
						value="no"
						bind:group={d[item.field]}
					/>
					No
				</label>
			</RadioGroup>
		</Field>
	{/each}
</Fieldset>
