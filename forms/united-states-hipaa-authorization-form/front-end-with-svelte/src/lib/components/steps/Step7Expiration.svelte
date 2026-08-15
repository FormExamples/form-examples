<script lang="ts">
	import { authorization } from '#lib/stores/authorization.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const d = authorization.data.expiration;
	const kinds = [
		{ value: 'date', label: 'A specific date' },
		{ value: 'event', label: 'The occurrence of an event' },
		{ value: 'duration', label: 'A duration after my signature' }
	];
</script>

<Fieldset legend="Expiration">
	<p class="hint">An expiration date or event is required. "None" is not permitted (except for research).</p>

	<Field label="This authorization expires on" required>
		<RadioGroup id="expiration-kind" label="This authorization expires on">
			{#each kinds as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="expiration-kind" value={opt.value} bind:group={d.kind} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.kind === 'date'}
		<Field label="Expiration date" inputId="expiration-expirationDate">
			<DateInput id="expiration-expirationDate" label="Expiration date" bind:value={d.expirationDate} />
		</Field>
	{/if}

	{#if d.kind === 'event'}
		<Field label="Expiration event" inputId="expiration-expirationEvent">
			<TextInput id="expiration-expirationEvent" label="Expiration event" placeholder="e.g., end of treatment" bind:value={d.expirationEvent} />
		</Field>
	{/if}

	{#if d.kind === 'duration'}
		<Field label="Duration (months)" inputId="expiration-durationMonths">
			<NumberInput id="expiration-durationMonths" label="Duration (months)" min={1} max={120} bind:value={d.durationMonths} />
		</Field>
	{/if}
</Fieldset>
