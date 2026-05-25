<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import MedicationEntry from '$lib/components/ui/MedicationEntry.svelte';

	const m = assessment.data.currentManagement;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Current Management">
	<p class="hint">Medications, immunotherapy, biologics, and avoidance strategies.</p>

	<Field label="Taking antihistamines?">
		<RadioGroup label="Antihistamines">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="antihistamines" value={opt.value} bind:group={m.antihistamines} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.antihistamines === 'yes'}
		<Field label="Antihistamine details" inputId="antihistamineDetails">
			<TextInput id="antihistamineDetails" label="Antihistamine details" bind:value={m.antihistamineDetails} />
		</Field>
	{/if}

	<Field label="Using nasal steroids?">
		<RadioGroup label="Nasal steroids">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="nasalSteroids" value={opt.value} bind:group={m.nasalSteroids} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Carry adrenaline auto-injector?">
		<RadioGroup label="Auto-injector">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="autoInjectorMgmt" value={opt.value} bind:group={m.adrenalineAutoInjector} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Receiving immunotherapy?">
		<RadioGroup label="Immunotherapy">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="immunotherapy" value={opt.value} bind:group={m.immunotherapy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.immunotherapy === 'yes'}
		<Field label="Immunotherapy details" inputId="immunotherapyDetails">
			<TextInput id="immunotherapyDetails" label="Immunotherapy details" bind:value={m.immunotherapyDetails} />
		</Field>
	{/if}

	<Field label="On biologic therapy?">
		<RadioGroup label="Biologics">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="biologics" value={opt.value} bind:group={m.biologics} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.biologics === 'yes'}
		<Field label="Biologic details" inputId="biologicDetails">
			<TextInput id="biologicDetails" label="Biologic details" bind:value={m.biologicDetails} />
		</Field>
	{/if}

	<Field label="Allergen avoidance strategies" inputId="avoidance">
		<TextAreaInput id="avoidance" label="Allergen avoidance strategies" rows={3} bind:value={m.allergenAvoidanceStrategies} />
	</Field>

	<Field label="Other medications">
		<MedicationEntry bind:medications={m.otherMedications} />
	</Field>
</Fieldset>
