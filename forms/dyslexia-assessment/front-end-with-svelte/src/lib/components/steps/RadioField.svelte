<script lang="ts">
	// Step-local convenience wrapper: a labelled Lily Field containing a Lily
	// RadioGroup of options bound to a single value. Keeps the long dyslexia
	// questionnaire's many yes/no/unsure questions concise while still emitting
	// the canonical Lily class contract (`field`, `radio-group`, `radio-input`).
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	let {
		label,
		name,
		value = $bindable(''),
		options,
		required = false
	}: {
		label: string;
		name: string;
		value?: string;
		options: { value: string; label: string }[];
		required?: boolean;
	} = $props();
</script>

<Field {label} {required}>
	<RadioGroup {label}>
		{#each options as opt (opt.value)}
			<label>
				<input type="radio" class="radio-input" {name} value={opt.value} bind:group={value} />
				{opt.label}
			</label>
		{/each}
	</RadioGroup>
</Field>
