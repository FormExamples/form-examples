<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const c = $state(assessment.data.comorbidities);
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Comorbidities">
	<p class="hint">Associated conditions: asthma, eczema, rhinitis, and other relevant conditions.</p>

	<Field label="Do you have asthma?">
		<RadioGroup label="Asthma">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="asthma" value={opt.value} bind:group={c.asthma} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.asthma === 'yes'}
		<Field label="Asthma severity" required inputId="asthmaSeverity">
			<Select id="asthmaSeverity" label="Asthma severity" required bind:value={c.asthmaSeverity}>
				<option value="">— Select —</option>
				<option value="mild">Mild</option>
				<option value="moderate">Moderate</option>
				<option value="severe">Severe</option>
			</Select>
		</Field>
	{/if}

	<Field label="Do you have eczema (atopic dermatitis)?">
		<RadioGroup label="Eczema">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="eczema" value={opt.value} bind:group={c.eczema} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.eczema === 'yes'}
		<Field label="Eczema severity" required inputId="eczemaSeverity">
			<Select id="eczemaSeverity" label="Eczema severity" required bind:value={c.eczemaSeverity}>
				<option value="">— Select —</option>
				<option value="mild">Mild</option>
				<option value="moderate">Moderate</option>
				<option value="severe">Severe</option>
			</Select>
		</Field>
	{/if}

	<Field label="Do you have rhinitis (allergic or non-allergic)?">
		<RadioGroup label="Rhinitis">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="rhinitis" value={opt.value} bind:group={c.rhinitis} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.rhinitis === 'yes'}
		<Field label="Rhinitis severity" required inputId="rhinitisSeverity">
			<Select id="rhinitisSeverity" label="Rhinitis severity" required bind:value={c.rhinitisSeverity}>
				<option value="">— Select —</option>
				<option value="mild">Mild</option>
				<option value="moderate">Moderate</option>
				<option value="severe">Severe</option>
			</Select>
		</Field>
	{/if}

	<Field label="Do you have eosinophilic oesophagitis?">
		<RadioGroup label="Eosinophilic oesophagitis">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="eoe" value={opt.value} bind:group={c.eosinophilicOesophagitis} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do you have a mast cell disorder?">
		<RadioGroup label="Mast cell disorder">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="mastCell" value={opt.value} bind:group={c.mastCellDisorders} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.mastCellDisorders === 'yes'}
		<Field label="Mast cell disorder details" inputId="mastCellDetails">
			<TextAreaInput id="mastCellDetails" label="Mast cell disorder details" rows={3} bind:value={c.mastCellDetails} />
		</Field>
	{/if}

	<Field label="Has your allergy affected your mental health?">
		<RadioGroup label="Mental health impact">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="mentalHealth" value={opt.value} bind:group={c.mentalHealthImpact} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.mentalHealthImpact === 'yes'}
		<Field label="Mental health impact details" inputId="mentalHealthDetails">
			<TextAreaInput id="mentalHealthDetails" label="Mental health impact details" rows={3} bind:value={c.mentalHealthDetails} />
		</Field>
	{/if}
</Fieldset>
