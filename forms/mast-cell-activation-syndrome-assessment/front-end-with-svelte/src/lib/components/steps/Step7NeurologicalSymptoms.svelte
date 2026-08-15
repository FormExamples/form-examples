<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { severityOptions, frequencyOptions } from '#lib/engine/symptom-rules.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import type { SymptomSeverity } from '#lib/engine/types.js';

	const n = assessment.data.neurologicalSymptoms;

	const symptoms = [
		{ key: 'headache' as const, label: 'Headache', desc: 'Persistent or recurring headaches, migraines' },
		{ key: 'brainFog' as const, label: 'Brain Fog', desc: 'Difficulty concentrating, mental confusion, memory problems' },
		{ key: 'dizziness' as const, label: 'Dizziness', desc: 'Feeling unsteady, vertigo, balance problems' },
		{ key: 'fatigue' as const, label: 'Fatigue', desc: 'Persistent tiredness, exhaustion not relieved by rest' }
	];

	function setSeverity(key: typeof symptoms[number]['key'], value: number) {
		assessment.data.neurologicalSymptoms[key].severity = value as SymptomSeverity;
	}
</script>

<Fieldset legend="Neurological Symptoms">
	<p class="hint">Rate the severity and frequency of your neurological symptoms.</p>

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
								checked={n[symptom.key].severity === opt.value}
								onchange={() => setSeverity(symptom.key, opt.value)}
							/>
							{opt.label}
						</label>
					{/each}
				</RadioGroup>
			</Field>

			<Field label={`${symptom.label} frequency`} inputId={`freq-${symptom.key}`}>
				<Select id={`freq-${symptom.key}`} label="Frequency" bind:value={n[symptom.key].frequency}>
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
