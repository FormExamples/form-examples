<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';

	const d = assessment.data.hairScalpExamination;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const distributionOptions = [
		{ value: 'normal', label: 'Normal' },
		{ value: 'thinning', label: 'Thinning' },
		{ value: 'patchy', label: 'Patchy' },
		{ value: 'sparse', label: 'Sparse / generalised loss' },
		{ value: 'hirsutism', label: 'Hirsutism' }
	];
	const textureOptions = [
		{ value: 'normal', label: 'Normal' },
		{ value: 'fine', label: 'Fine / brittle' },
		{ value: 'coarse', label: 'Coarse' },
		{ value: 'dry', label: 'Dry' },
		{ value: 'oily', label: 'Oily' }
	];
	const alopeciaPatternOptions = [
		{ value: 'androgenetic', label: 'Androgenetic / pattern baldness' },
		{ value: 'alopecia-areata', label: 'Alopecia areata (patchy)' },
		{ value: 'totalis', label: 'Alopecia totalis (whole scalp)' },
		{ value: 'universalis', label: 'Alopecia universalis (whole body)' },
		{ value: 'traction', label: 'Traction alopecia' },
		{ value: 'scarring', label: 'Scarring (cicatricial)' },
		{ value: 'telogen-effluvium', label: 'Telogen effluvium' }
	];
	const scalpFindingOptions = [
		{ value: 'dandruff', label: 'Dandruff / seborrhoea' },
		{ value: 'psoriasis', label: 'Psoriasis' },
		{ value: 'lice', label: 'Pediculosis (head lice)' },
		{ value: 'tinea', label: 'Tinea capitis' },
		{ value: 'folliculitis', label: 'Folliculitis' },
		{ value: 'cyst', label: 'Sebaceous cyst' },
		{ value: 'naevus', label: 'Pigmented naevus' }
	];
</script>

<Fieldset legend="Hair & Scalp Examination">
	<p class="hint">Distribution, texture, alopecia, scalp lesions.</p>

	<Field label="Hair distribution" inputId="hairDistribution">
		<Select id="hairDistribution" label="Hair distribution" bind:value={d.hairDistribution}>
			<option value="">— Select —</option>
			{#each distributionOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Hair texture" inputId="hairTexture">
		<Select id="hairTexture" label="Hair texture" bind:value={d.hairTexture}>
			<option value="">— Select —</option>
			{#each textureOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Alopecia present?">
		<RadioGroup label="Alopecia present?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="alopecia" value={opt.value} bind:group={d.alopecia} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.alopecia === 'yes'}
		<Field label="Alopecia pattern" inputId="alopeciaPattern">
			<Select id="alopeciaPattern" label="Alopecia pattern" bind:value={d.alopeciaPattern}>
				<option value="">— Select —</option>
				{#each alopeciaPatternOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>
	{/if}

	<Field label="Scalp lesions present?">
		<RadioGroup label="Scalp lesions present?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="scalpLesions" value={opt.value} bind:group={d.scalpLesions} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Scalp findings (tick all that apply)">
		<CheckboxGroup label="Scalp findings" class="grid grid-cols-1 gap-1 sm:grid-cols-2">
			{#each scalpFindingOptions as opt (opt.value)}
				<label><input type="checkbox" class="checkbox-input" value={opt.value} bind:group={d.scalpFindings} /> {opt.label}</label>
			{/each}
		</CheckboxGroup>
	</Field>

	<Field label="Scalp / hair notes" inputId="scalpNotes">
		<TextAreaInput id="scalpNotes" label="Scalp / hair notes" rows={3} placeholder="Any other findings…" bind:value={d.scalpNotes} />
	</Field>
</Fieldset>
