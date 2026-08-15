<script lang="ts">
	// The Oxford Hip Score (OHS): 12 items, each a 0 (worst) to 4 (best)
	// response scale, summing to a 0-48 total. See doc/ohs-scoring.md for the
	// item concepts and the licensing note on the instrument's wording.
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import { OHS_ITEMS } from '#lib/config/ohs-items.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
	const result = $derived(evaluationStore.result);
</script>

<Fieldset legend="4. Oxford Hip Score">
	<p class="hint">
		Twelve items, each scored 0 (worst) to 4 (best); the total is 0–48, where 48 is the best
		possible outcome. Running total: <strong>{result.ohsTotal} / 48</strong> ({result.ohsCategory || 'not yet scored'}).
	</p>

	{#each OHS_ITEMS as item (item.key)}
		<Field label={`${item.number}. ${item.question}`} inputId={`ohs-${item.key}`} required>
			<RadioGroup label={item.question}>
				{#each item.options as option (option.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name={`ohs-${item.key}`}
							value={option.value}
							checked={d.ohs[item.key] === option.value}
							onchange={() => (d.ohs[item.key] = option.value)}
							required
						/>
						{option.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}
</Fieldset>
