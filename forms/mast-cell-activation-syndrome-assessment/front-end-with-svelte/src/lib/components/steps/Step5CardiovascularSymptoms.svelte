<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { severityOptions, frequencyOptions } from '$lib/engine/symptom-rules';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import type { SymptomSeverity } from '$lib/engine/types';

	const c = assessment.data.cardiovascularSymptoms;

	const symptoms = [
		{ key: 'tachycardia' as const, label: 'Tachycardia', desc: 'Rapid heart rate or heart pounding/racing' },
		{ key: 'hypotension' as const, label: 'Hypotension', desc: 'Low blood pressure, lightheadedness on standing' },
		{ key: 'presyncope' as const, label: 'Presyncope', desc: 'Feeling faint, near-fainting episodes' },
		{ key: 'syncope' as const, label: 'Syncope', desc: 'Complete loss of consciousness / fainting' }
	];

	function setSeverity(key: typeof symptoms[number]['key'], value: number) {
		assessment.data.cardiovascularSymptoms[key].severity = value as SymptomSeverity;
	}
</script>

<Fieldset legend="Cardiovascular Symptoms">
	<p class="hint">Rate the severity and frequency of your heart and blood pressure symptoms.</p>

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
								checked={c[symptom.key].severity === opt.value}
								onchange={() => setSeverity(symptom.key, opt.value)}
							/>
							{opt.label}
						</label>
					{/each}
				</RadioGroup>
			</Field>

			<Field label={`${symptom.label} frequency`} inputId={`freq-${symptom.key}`}>
				<Select id={`freq-${symptom.key}`} label="Frequency" bind:value={c[symptom.key].frequency}>
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
