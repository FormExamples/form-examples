<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const a = assessment.data.ascitesStep;
	const options = [
		{ value: 'none', label: 'None — 1 point' },
		{ value: 'mild', label: 'Mild, diuretic-responsive — 2 points' },
		{ value: 'moderate-severe', label: 'Moderate-to-severe, diuretic-refractory — 3 points' }
	];
</script>

<Fieldset legend="Step 6 of 8 — Ascites">
	<p class="hint">Parameter 4 — clinical grade of ascites.</p>

	<Field label="Ascites grade">
		<RadioGroup label="Ascites grade">
			{#each options as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="ascites-grade"
						value={opt.value}
						bind:group={a.ascites}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
