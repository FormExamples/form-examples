<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const u = assessment.data.upperGISymptoms;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Upper GI Symptoms">
	<p class="hint">Symptoms affecting the oesophagus and stomach.</p>

	<Field label="Do you have difficulty swallowing (dysphagia)?">
		<RadioGroup label="Dysphagia">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="dysphagia" value={opt.value} bind:group={u.dysphagia} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if u.dysphagia === 'yes'}
		<Field label="Please describe (solids, liquids, or both)" inputId="dysphagiaDetails">
			<TextInput id="dysphagiaDetails" label="Dysphagia details" bind:value={u.dysphagiaDetails} />
		</Field>
	{/if}

	<Field label="Do you have pain on swallowing (odynophagia)?">
		<RadioGroup label="Odynophagia">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="odynophagia" value={opt.value} bind:group={u.odynophagia} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do you experience heartburn or acid reflux?">
		<RadioGroup label="Heartburn">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="heartburn" value={opt.value} bind:group={u.heartburn} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if u.heartburn === 'yes'}
		<Field label="How often?" inputId="heartburnFrequency">
			<TextInput id="heartburnFrequency" label="Heartburn frequency" placeholder="e.g. daily, weekly" bind:value={u.heartburnFrequency} />
		</Field>
	{/if}

	<Field label="Do you experience nausea?">
		<RadioGroup label="Nausea">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="nausea" value={opt.value} bind:group={u.nausea} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do you experience vomiting?">
		<RadioGroup label="Vomiting">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="vomiting" value={opt.value} bind:group={u.vomiting} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if u.vomiting === 'yes'}
		<Field label="Describe the vomiting (frequency, blood present, etc.)" inputId="vomitingDetails">
			<TextAreaInput id="vomitingDetails" label="Vomiting details" rows={3} bind:value={u.vomitingDetails} />
		</Field>
	{/if}

	<Field label="Do you feel full quickly after eating (early satiety)?">
		<RadioGroup label="Early satiety">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="earlySatiety" value={opt.value} bind:group={u.earlySatiety} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
