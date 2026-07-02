<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { aldreteScore, ALDRETE_OPTIONS } from '$lib/engine/pacu-rules';
	import { scoreColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.oxygenSaturation;
	const options = ALDRETE_OPTIONS.oxygenSaturation;
	const score = $derived(aldreteScore('oxygenSaturation', s.oxygenSaturation));
</script>

<Fieldset legend="Step 7 of 10 — Aldrete — oxygen saturation">
	<p class="hint">SpO2 and supplemental-oxygen need. This parameter gates discharge-readiness: it must score 2.</p>

	<Field label="Aldrete — oxygen saturation">
		<RadioGroup label="Aldrete — oxygen saturation">
			{#each options as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="oxygenSaturation-oxygenSaturation"
						value={opt.value}
						bind:group={s.oxygenSaturation}
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
