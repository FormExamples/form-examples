<script lang="ts">
	import { authorization } from '$lib/stores/authorization.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = authorization.data.disclosingSource;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const modes = [
		{ value: 'specific', label: 'The following specific persons or organisations' },
		{ value: 'class', label: 'The following class of providers (doctors, hospitals, clinics, etc.)' }
	];
</script>

<Fieldset legend="Disclosing source">
	<p class="hint">Who is authorised to release the information?</p>

	<Field label="I authorize information to be released by" required>
		<RadioGroup id="disclosingSource-identificationMode" label="I authorize information to be released by">
			{#each modes as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="disclosingSource-identificationMode" value={opt.value} bind:group={d.identificationMode} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.identificationMode === 'specific'}
		<Field label="Specific persons / organizations" inputId="disclosingSource-specificPersonsOrOrganizations">
			<TextAreaInput
				id="disclosingSource-specificPersonsOrOrganizations"
				label="Specific persons / organizations"
				rows={2}
				placeholder="List individuals or named entities."
				bind:value={d.specificPersonsOrOrganizations}
			/>
		</Field>
	{/if}

	{#if d.identificationMode === 'class'}
		<Field label="Class description" inputId="disclosingSource-classDescription">
			<TextAreaInput
				id="disclosingSource-classDescription"
				label="Class description"
				rows={2}
				placeholder="e.g., All doctors and hospitals who treated me from 2020 to today."
				bind:value={d.classDescription}
			/>
		</Field>
	{/if}

	<Field label="Are any of these records held by a US Department of Veterans Affairs facility?">
		<RadioGroup label="Are any of these records held by a VA facility?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="disclosingSource-isVaFacility" value={opt.value} bind:group={d.isVaFacility} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
