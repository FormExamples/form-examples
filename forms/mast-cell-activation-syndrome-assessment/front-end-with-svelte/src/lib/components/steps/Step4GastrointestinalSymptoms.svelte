<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { severityOptions, frequencyOptions } from '#lib/engine/symptom-rules.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import type { SymptomSeverity } from '#lib/engine/types.js';

	const g = assessment.data.gastrointestinalSymptoms;

	const symptoms = [
		{ key: 'abdominalPain' as const, label: 'Abdominal Pain', desc: 'Cramping, aching, or sharp pain in the abdomen' },
		{ key: 'nausea' as const, label: 'Nausea', desc: 'Feeling of sickness or urge to vomit' },
		{ key: 'diarrhea' as const, label: 'Diarrhea', desc: 'Loose or watery stools, increased bowel frequency' },
		{ key: 'bloating' as const, label: 'Bloating', desc: 'Abdominal distension, feeling of fullness or swelling' }
	];

	function setSeverity(key: typeof symptoms[number]['key'], value: number) {
		assessment.data.gastrointestinalSymptoms[key].severity = value as SymptomSeverity;
	}
</script>

<Fieldset legend="Gastrointestinal Symptoms">
	<p class="hint">Rate the severity and frequency of your digestive symptoms.</p>

	{#each symptoms as symptom (symptom.key)}
		<div class="symptom-row">
			<Field label={symptom.label} description={symptom.desc}>
				<RadioGroup label={`${symptom.label} severity`}>
					{#each severityOptions as opt (opt.value)}
						<label>
							<input
								type="radio"
								class="radio-input"
								name={`severity-${symptom.key}`}
								value={opt.value}
								checked={g[symptom.key].severity === opt.value}
								onchange={() => setSeverity(symptom.key, opt.value)}
							/>
							{opt.label}
						</label>
					{/each}
				</RadioGroup>
			</Field>

			<Field label={`${symptom.label} frequency`} inputId={`freq-${symptom.key}`}>
				<Select id={`freq-${symptom.key}`} label="Frequency" bind:value={g[symptom.key].frequency}>
					<option value="">-- Select --</option>
					{#each frequencyOptions as opt (opt.value)}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</Select>
			</Field>
		</div>
	{/each}
</Fieldset>

<style>
	.symptom-row { padding-bottom: 1rem; border-bottom: 1px solid var(--color-border); margin-bottom: 1rem; }
	.symptom-row:last-child { border-bottom: 0; margin-bottom: 0; }
</style>
