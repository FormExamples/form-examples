<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const o = assessment.data.otoscopicFindings;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Otoscopic Findings">
	<p class="hint">External and middle ear examination.</p>

	<h3 class="step-subhead">Ear Canal</h3>
	<div class="field-grid">
		<Field label="Right Ear Canal" inputId="earCanalRight">
			<Select id="earCanalRight" label="Right Ear Canal" bind:value={o.earCanalRight}>
				<option value="">— Select —</option>
				<option value="normal">Normal</option>
				<option value="narrowed">Narrowed</option>
				<option value="inflamed">Inflamed</option>
				<option value="exostosis">Exostosis</option>
				<option value="other">Other</option>
			</Select>
		</Field>
		<Field label="Left Ear Canal" inputId="earCanalLeft">
			<Select id="earCanalLeft" label="Left Ear Canal" bind:value={o.earCanalLeft}>
				<option value="">— Select —</option>
				<option value="normal">Normal</option>
				<option value="narrowed">Narrowed</option>
				<option value="inflamed">Inflamed</option>
				<option value="exostosis">Exostosis</option>
				<option value="other">Other</option>
			</Select>
		</Field>
	</div>

	<h3 class="step-subhead">Tympanic Membrane</h3>
	<div class="field-grid">
		<Field label="Right Tympanic Membrane" inputId="tmRight">
			<Select id="tmRight" label="Right TM" bind:value={o.tympanicMembraneRight}>
				<option value="">— Select —</option>
				<option value="normal">Normal</option>
				<option value="retracted">Retracted</option>
				<option value="perforated">Perforated</option>
				<option value="scarred">Scarred</option>
				<option value="effusion">Effusion visible</option>
				<option value="other">Other</option>
			</Select>
		</Field>
		<Field label="Left Tympanic Membrane" inputId="tmLeft">
			<Select id="tmLeft" label="Left TM" bind:value={o.tympanicMembraneLeft}>
				<option value="">— Select —</option>
				<option value="normal">Normal</option>
				<option value="retracted">Retracted</option>
				<option value="perforated">Perforated</option>
				<option value="scarred">Scarred</option>
				<option value="effusion">Effusion visible</option>
				<option value="other">Other</option>
			</Select>
		</Field>
	</div>

	<h3 class="step-subhead">Middle Ear</h3>
	<div class="field-grid">
		<Field label="Right Middle Ear Findings" inputId="middleEarRight">
			<TextInput id="middleEarRight" label="Right middle ear" bind:value={o.middleEarRight} />
		</Field>
		<Field label="Left Middle Ear Findings" inputId="middleEarLeft">
			<TextInput id="middleEarLeft" label="Left middle ear" bind:value={o.middleEarLeft} />
		</Field>
	</div>

	<h3 class="step-subhead">Ear Wax</h3>
	<div class="field-grid">
		<Field label="Ear wax present (Right)?">
			<RadioGroup label="Ear wax right">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="earWaxRight" value={opt.value} bind:group={o.earWaxRight} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label="Ear wax present (Left)?">
			<RadioGroup label="Ear wax left">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="earWaxLeft" value={opt.value} bind:group={o.earWaxLeft} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	<h3 class="step-subhead">Discharge</h3>
	<div class="field-grid">
		<Field label="Discharge present (Right)?">
			<RadioGroup label="Discharge right">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="dischargeRight" value={opt.value} bind:group={o.dischargeRight} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label="Discharge present (Left)?">
			<RadioGroup label="Discharge left">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="dischargeLeft" value={opt.value} bind:group={o.dischargeLeft} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	<Field label="Previous ear surgery?">
		<RadioGroup label="Previous ear surgery">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousSurgery" value={opt.value} bind:group={o.previousSurgery} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if o.previousSurgery === 'yes'}
		<Field label="Surgery details" inputId="previousSurgeryDetails">
			<TextInput id="previousSurgeryDetails" label="Surgery details" bind:value={o.previousSurgeryDetails} />
		</Field>
	{/if}
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
	.step-subhead { font-size: 1rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
</style>
