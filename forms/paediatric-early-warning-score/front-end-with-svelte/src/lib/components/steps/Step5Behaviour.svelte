<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { computeSubscores } from '$lib/engine/pews-grader';
	import { subscoreColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const b = assessment.data.behaviour;
	const points = $derived(computeSubscores(assessment.data).consciousness);
	const options = [
		{ value: 'alert', label: 'Alert / playing' },
		{ value: 'voice', label: 'Responds to Voice / irritable' },
		{ value: 'pain', label: 'Responds to Pain' },
		{ value: 'unresponsive', label: 'Unresponsive' }
	];
</script>

<Fieldset legend="Step 5 of 7 — Behaviour (ACVPU)">
	<p class="hint">
		Level of consciousness / behaviour on the ACVPU scale: Alert 0, Voice 1, Pain 2, Unresponsive
		3.
	</p>

	<Field label="Level of consciousness (ACVPU)">
		<RadioGroup label="Level of consciousness (ACVPU)">
			{#each options as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="behaviour-consciousness"
						value={opt.value}
						bind:group={b.consciousness}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Consciousness subscore">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold {subscoreColor(points)}"
		>
			{points === null ? 'Not recorded' : `${points} point${points === 1 ? '' : 's'}`}
		</span>
	</Field>
</Fieldset>
