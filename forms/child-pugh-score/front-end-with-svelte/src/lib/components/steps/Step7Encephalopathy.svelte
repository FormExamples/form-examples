<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const e = assessment.data.encephalopathyStep;
	const options = [
		{ value: 'none', label: 'None — 1 point' },
		{ value: 'grade-1-2', label: 'Grade 1-2, or medically controlled — 2 points' },
		{ value: 'grade-3-4', label: 'Grade 3-4, or refractory — 3 points' }
	];
</script>

<Fieldset legend="Step 7 of 8 — Hepatic encephalopathy">
	<p class="hint">Parameter 5 — clinical grade of hepatic encephalopathy (West Haven criteria).</p>

	<Field label="Hepatic encephalopathy grade">
		<RadioGroup label="Hepatic encephalopathy grade">
			{#each options as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="encephalopathy-grade"
						value={opt.value}
						bind:group={e.encephalopathy}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
