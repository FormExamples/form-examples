<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.carerSupport;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Carer & Support Network">
	<p class="hint">Who supports the person day to day.</p>

	<div class="field-grid">
		<Field label="Primary carer name" inputId="primaryCarerName">
			<TextInput id="primaryCarerName" label="Primary carer name" bind:value={c.primaryCarerName} />
		</Field>
		<Field label="Relationship" inputId="primaryCarerRelationship">
			<TextInput id="primaryCarerRelationship" label="Relationship" placeholder="e.g. mother, paid carer" bind:value={c.primaryCarerRelationship} />
		</Field>
	</div>

	<Field label="Primary carer phone" inputId="primaryCarerPhone">
		<TextInput id="primaryCarerPhone" label="Primary carer phone" bind:value={c.primaryCarerPhone} />
	</Field>

	<Field label="Does the person live with their primary carer?">
		<RadioGroup label="Does the person live with their primary carer?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="livesWithCarer" value={opt.value} bind:group={c.livesWithCarer} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Living arrangement" inputId="livingArrangement">
		<TextInput id="livingArrangement" label="Living arrangement" placeholder="e.g. supported living, family home, residential care" bind:value={c.livingArrangement} />
	</Field>

	<Field label="Is there a documented support plan?">
		<RadioGroup label="Is there a documented support plan?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasSupportPlan" value={opt.value} bind:group={c.hasSupportPlan} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Does the person have a social worker?">
		<RadioGroup label="Does the person have a social worker?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasSocialWorker" value={opt.value} bind:group={c.hasSocialWorker} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if c.hasSocialWorker === 'yes'}
		<Field label="Social worker name" inputId="socialWorkerName">
			<TextInput id="socialWorkerName" label="Social worker name" bind:value={c.socialWorkerName} />
		</Field>
	{/if}

	<Field label="Other supports (day services, advocacy, charities…)" inputId="otherSupports">
		<TextAreaInput id="otherSupports" label="Other supports" rows={2} bind:value={c.otherSupports} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
