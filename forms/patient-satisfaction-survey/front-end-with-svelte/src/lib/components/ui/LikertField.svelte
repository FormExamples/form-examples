<script lang="ts">
	// LikertField — a 5-point satisfaction rating built from the Lily RadioGroup
	// + radio-input contract. Binds a `number | null` value (null = unrated).
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	let {
		label,
		name,
		value = $bindable<number | null>(null),
		anchorId = undefined
	}: {
		label: string;
		name: string;
		value?: number | null;
		anchorId?: string;
	} = $props();

	const options: { score: number; text: string }[] = [
		{ score: 1, text: 'Very Dissatisfied' },
		{ score: 2, text: 'Dissatisfied' },
		{ score: 3, text: 'Neutral' },
		{ score: 4, text: 'Satisfied' },
		{ score: 5, text: 'Very Satisfied' }
	];
</script>

<Field {label}>
	<RadioGroup {label} id={anchorId}>
		{#each options as opt (opt.score)}
			<label class="likert-option">
				<input type="radio" class="radio-input" {name} value={opt.score} bind:group={value} />
				<span>{opt.score} — {opt.text}</span>
			</label>
		{/each}
	</RadioGroup>
</Field>

<style>
	.likert-option {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		margin-right: 1rem;
	}
</style>
