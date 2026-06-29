<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { linguisticTotal, LINGUISTIC_MAX } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.linguisticCriteria;
	const bands = [0, 1, 2, 3, 4, 5, 6];

	const total = $derived(linguisticTotal(d));
</script>

<Fieldset legend="Linguistic criteria rating">
	<p class="hint">
		Rate each linguistic criterion on the OET 0-6 band scale. Band 4 is the functional threshold;
		bands 5-6 indicate strong professional command.
	</p>

	<Field label="Intelligibility" description="Pronunciation, stress, intonation and rhythm">
		<RadioGroup label="Intelligibility band">
			{#each bands as n (n)}
				<label>
					<input type="radio" class="radio-input" id={n === 0 ? 'intelligibility' : undefined} name="intelligibility" value={n} bind:group={d.intelligibility} />
					{n}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Fluency" description="Speech rate, continuity and flow">
		<RadioGroup label="Fluency band">
			{#each bands as n (n)}
				<label>
					<input type="radio" class="radio-input" name="fluency" value={n} bind:group={d.fluency} />
					{n}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Appropriateness of language" description="Register, tone and professional vocabulary">
		<RadioGroup label="Appropriateness of language band">
			{#each bands as n (n)}
				<label>
					<input type="radio" class="radio-input" name="appropriatenessOfLanguage" value={n} bind:group={d.appropriatenessOfLanguage} />
					{n}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Resources of grammar & expression" description="Grammatical range, accuracy and flexibility">
		<RadioGroup label="Resources of grammar and expression band">
			{#each bands as n (n)}
				<label>
					<input type="radio" class="radio-input" name="resourcesOfGrammarAndExpression" value={n} bind:group={d.resourcesOfGrammarAndExpression} />
					{n}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<p class="subtotal">Linguistic subtotal: <strong>{total} / {LINGUISTIC_MAX}</strong></p>
</Fieldset>

<style>
	.subtotal {
		margin-top: 1rem;
		font-size: 0.95rem;
	}
</style>
