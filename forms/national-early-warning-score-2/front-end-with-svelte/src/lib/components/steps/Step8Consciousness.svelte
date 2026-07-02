<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { computeSubscores } from '$lib/engine/news2-grader';
	import { subscoreColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const con = assessment.data.consciousness;
	const points = $derived(computeSubscores(assessment.data).consciousness);
	const options = [
		{ value: 'A', label: 'Alert' },
		{ value: 'C', label: 'New confusion' },
		{ value: 'V', label: 'Responds to Voice' },
		{ value: 'P', label: 'Responds to Pain' },
		{ value: 'U', label: 'Unresponsive' }
	];
</script>

<Fieldset legend="Step 8 of 10 — Consciousness (ACVPU)">
	<p class="hint">
		Parameter 6 — only "Alert" scores 0; new-onset Confusion, Voice, Pain, and Unresponsive each
		score 3.
	</p>

	<Field label="Level of consciousness (ACVPU)">
		<RadioGroup label="Level of consciousness (ACVPU)">
			{#each options as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="consciousness-consciousnessAcvpu"
						value={opt.value}
						bind:group={con.consciousnessAcvpu}
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
			{points === null ? 'Not recorded' : `${points} points`}
		</span>
	</Field>
</Fieldset>
