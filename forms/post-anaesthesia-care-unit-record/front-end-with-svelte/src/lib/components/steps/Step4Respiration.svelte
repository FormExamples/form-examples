<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { aldreteScore, ALDRETE_OPTIONS } from '$lib/engine/pacu-rules';
	import { scoreColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.respiration;
	const options = ALDRETE_OPTIONS.respiration;
	const score = $derived(aldreteScore('respiration', s.respiration));
</script>

<Fieldset legend="Step 4 of 10 — Aldrete — respiration">
	<p class="hint">Breathing effort, cough, and ventilation need (scores 0, 1, or 2).</p>

	<Field label="Aldrete — respiration">
		<RadioGroup label="Aldrete — respiration">
			{#each options as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="respiration-respiration"
						value={opt.value}
						bind:group={s.respiration}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Parameter sub-score">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {scoreColor(score)}">
			{score} of 2
		</span>
	</Field>
</Fieldset>
