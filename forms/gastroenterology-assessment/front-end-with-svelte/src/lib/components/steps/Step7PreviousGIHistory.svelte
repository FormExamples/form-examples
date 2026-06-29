<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const h = assessment.data.previousGIHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Previous GI History">
	<p class="hint">Previous gastroenterological investigations and diagnoses.</p>

	<Field label="Have you had an endoscopy (camera down the throat)?">
		<RadioGroup label="Endoscopy">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="endoscopy" value={opt.value} bind:group={h.previousEndoscopy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.previousEndoscopy === 'yes'}
		<Field label="When and what were the findings?" inputId="endoscopyDetails">
			<TextAreaInput id="endoscopyDetails" label="Endoscopy details" rows={3} bind:value={h.endoscopyDetails} />
		</Field>
	{/if}

	<Field label="Have you had a colonoscopy?">
		<RadioGroup label="Colonoscopy">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="colonoscopy" value={opt.value} bind:group={h.previousColonoscopy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.previousColonoscopy === 'yes'}
		<Field label="When and what were the findings?" inputId="colonoscopyDetails">
			<TextAreaInput id="colonoscopyDetails" label="Colonoscopy details" rows={3} bind:value={h.colonoscopyDetails} />
		</Field>
	{/if}

	<Field label="Have you had any previous GI surgery?">
		<RadioGroup label="Previous GI surgery">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="giSurgery" value={opt.value} bind:group={h.previousGISurgery} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.previousGISurgery === 'yes'}
		<Field label="What surgery and when?" inputId="surgeryDetails">
			<TextAreaInput id="surgeryDetails" label="Surgery details" rows={3} bind:value={h.surgeryDetails} />
		</Field>
	{/if}

	<Field label="Have you been diagnosed with inflammatory bowel disease (IBD)?">
		<RadioGroup label="IBD">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="ibd" value={opt.value} bind:group={h.ibd} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.ibd === 'yes'}
		<Field label="Which type?" inputId="ibdType">
			<Select id="ibdType" label="IBD type" bind:value={h.ibdType}>
				<option value="">-- Select --</option>
				<option value="crohns">Crohn's Disease</option>
				<option value="ulcerative-colitis">Ulcerative Colitis</option>
			</Select>
		</Field>
	{/if}

	<Field label="Have you been diagnosed with irritable bowel syndrome (IBS)?">
		<RadioGroup label="IBS">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="ibs" value={opt.value} bind:group={h.ibs} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you been diagnosed with coeliac disease?">
		<RadioGroup label="Coeliac disease">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="celiac" value={opt.value} bind:group={h.celiacDisease} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you ever had polyps found?">
		<RadioGroup label="Polyps">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="polyps" value={opt.value} bind:group={h.polyps} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.polyps === 'yes'}
		<Field label="Details (type, number, location)" inputId="polypDetails">
			<TextInput id="polypDetails" label="Polyp details" bind:value={h.polypDetails} />
		</Field>
	{/if}

	<Field label="Have you ever been diagnosed with a GI cancer?">
		<RadioGroup label="GI cancer">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="giCancer" value={opt.value} bind:group={h.giCancer} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if h.giCancer === 'yes'}
		<Field label="Please provide details (type, treatment, when)" inputId="cancerDetails">
			<TextAreaInput id="cancerDetails" label="GI cancer details" rows={3} bind:value={h.giCancerDetails} />
		</Field>
	{/if}
</Fieldset>
