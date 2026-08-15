<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { severityOptions, frequencyOptions } from '#lib/engine/symptom-rules.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import type { SymptomSeverity } from '#lib/engine/types.js';

	const d = assessment.data.dermatologicalSymptoms;

	const symptoms = [
		{ key: 'flushing' as const, label: 'Flushing', desc: 'Redness and warmth of the skin, especially face, neck, and chest' },
		{ key: 'urticaria' as const, label: 'Urticaria (Hives)', desc: 'Itchy, raised welts or bumps on the skin' },
		{ key: 'angioedema' as const, label: 'Angioedema', desc: 'Deep swelling under the skin, often around eyes, lips, or hands' },
		{ key: 'pruritus' as const, label: 'Pruritus (Itching)', desc: 'Generalised itching without visible rash' }
	];

	function setSeverity(key: typeof symptoms[number]['key'], value: number) {
		assessment.data.dermatologicalSymptoms[key].severity = value as SymptomSeverity;
	}
</script>

<Fieldset legend="Dermatological Symptoms">
	<p class="hint">Rate the severity and frequency of your skin-related symptoms.</p>

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
								checked={d[symptom.key].severity === opt.value}
								onchange={() => setSeverity(symptom.key, opt.value)}
							/>
							{opt.label}
						</label>
					{/each}
				</RadioGroup>
			</Field>

			<Field label={`${symptom.label} frequency`} inputId={`freq-${symptom.key}`}>
				<Select id={`freq-${symptom.key}`} label="Frequency" bind:value={d[symptom.key].frequency}>
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
