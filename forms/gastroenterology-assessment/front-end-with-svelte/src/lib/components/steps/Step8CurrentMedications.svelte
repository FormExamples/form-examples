<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import MedicationEntry from '#lib/components/ui/MedicationEntry.svelte';

	const m = assessment.data.currentMedications;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Current Medications">
	<p class="hint">GI-related and other medications you are currently taking.</p>

	<Field label="Are you taking proton pump inhibitors (PPIs) such as omeprazole, lansoprazole?">
		<RadioGroup label="PPIs">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="ppis" value={opt.value} bind:group={m.ppis} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.ppis === 'yes'}
		<Field label="Which PPI and dose?" inputId="ppiDetails">
			<TextInput id="ppiDetails" label="PPI details" bind:value={m.ppiDetails} />
		</Field>
	{/if}

	<Field label="Are you taking antacids (e.g. Gaviscon, Rennie)?">
		<RadioGroup label="Antacids">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="antacids" value={opt.value} bind:group={m.antacids} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Are you taking laxatives?">
		<RadioGroup label="Laxatives">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="laxatives" value={opt.value} bind:group={m.laxatives} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.laxatives === 'yes'}
		<Field label="Which laxative?" inputId="laxativeDetails">
			<TextInput id="laxativeDetails" label="Laxative details" bind:value={m.laxativeDetails} />
		</Field>
	{/if}

	<Field label="Are you taking anti-diarrhoeal medication (e.g. loperamide)?">
		<RadioGroup label="Anti-diarrhoeals">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="antiDiarrhoeals" value={opt.value} bind:group={m.antiDiarrhoeals} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Are you on biologic therapy (e.g. infliximab, adalimumab)?">
		<RadioGroup label="Biologics">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="biologics" value={opt.value} bind:group={m.biologics} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.biologics === 'yes'}
		<Field label="Which biologic?" inputId="biologicDetails">
			<TextInput id="biologicDetails" label="Biologic details" bind:value={m.biologicDetails} />
		</Field>
	{/if}

	<Field label="Are you taking steroids (e.g. prednisolone, budesonide)?">
		<RadioGroup label="Steroids">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="steroids" value={opt.value} bind:group={m.steroids} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.steroids === 'yes'}
		<Field label="Which steroid and dose?" inputId="steroidDetails">
			<TextInput id="steroidDetails" label="Steroid details" bind:value={m.steroidDetails} />
		</Field>
	{/if}

	<Field label="Are you taking NSAIDs (e.g. ibuprofen, naproxen, aspirin)?">
		<RadioGroup label="NSAIDs">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="nsaids" value={opt.value} bind:group={m.nsaids} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.nsaids === 'yes'}
		<Field label="Which NSAID?" inputId="nsaidDetails">
			<TextInput id="nsaidDetails" label="NSAID details" bind:value={m.nsaidDetails} />
		</Field>
	{/if}

	<Field label="Other Medications">
		<MedicationEntry bind:medications={m.otherMedications} />
		{#if m.otherMedications.length === 0}
			<p class="hint">No other medications added. Click the button above to add one, or proceed if you take none.</p>
		{/if}
	</Field>
</Fieldset>
