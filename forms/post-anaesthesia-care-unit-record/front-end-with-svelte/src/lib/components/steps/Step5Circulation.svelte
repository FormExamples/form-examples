<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { aldreteScore, ALDRETE_OPTIONS } from '#lib/engine/pacu-rules.js';
	import { scoreColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.circulation;
	const options = ALDRETE_OPTIONS.circulation;
	const score = $derived(aldreteScore('circulation', s.circulation));
</script>

<Fieldset legend="Step 5 of 10 — Aldrete — circulation">
	<p class="hint">Blood-pressure deviation from the pre-anaesthetic baseline (scores 0, 1, or 2).</p>

	<Field label="Aldrete — circulation">
		<RadioGroup label="Aldrete — circulation">
			{#each options as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="circulation-circulation"
						value={opt.value}
						bind:group={s.circulation}
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
