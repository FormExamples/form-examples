<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { computeSubscores } from '#lib/engine/mews-grader.js';
	import { subscoreColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const con = assessment.data.consciousness;
	const points = $derived(computeSubscores(assessment.data).avpu);
	const options = [
		{ value: 'alert', label: 'Alert' },
		{ value: 'voice', label: 'Responds to voice' },
		{ value: 'pain', label: 'Responds to pain' },
		{ value: 'unresponsive', label: 'Unresponsive' }
	];
</script>

<Fieldset legend="Step 7 of 8 — Consciousness (AVPU)">
	<p class="hint">
		Parameter 5 — Alert scores 0, Voice 1, Pain 2, and Unresponsive 3 (a single-parameter trigger).
	</p>

	<Field label="Level of consciousness (AVPU)">
		<RadioGroup label="Level of consciousness (AVPU)">
			{#each options as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="consciousness-avpu"
						value={opt.value}
						bind:group={con.avpu}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Consciousness subscore">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {subscoreColor(points)}">
			{points === null ? 'Not recorded' : `${points} point${points === 1 ? '' : 's'}`}
		</span>
	</Field>
</Fieldset>
