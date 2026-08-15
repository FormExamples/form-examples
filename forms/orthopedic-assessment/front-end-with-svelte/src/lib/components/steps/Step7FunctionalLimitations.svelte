<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const fl = assessment.data.functionalLimitations;

	const adlOptions = [
		{ value: 'dressing', label: 'Dressing' },
		{ value: 'bathing', label: 'Bathing' },
		{ value: 'cooking', label: 'Cooking' },
		{ value: 'cleaning', label: 'Cleaning' },
		{ value: 'driving', label: 'Driving' },
		{ value: 'writing', label: 'Writing' },
		{ value: 'typing', label: 'Typing' },
		{ value: 'lifting', label: 'Lifting' },
		{ value: 'carrying', label: 'Carrying' },
		{ value: 'reaching-overhead', label: 'Reaching overhead' },
		{ value: 'gripping', label: 'Gripping objects' },
		{ value: 'opening-jars', label: 'Opening jars' }
	];
	const aidOptions = [
		{ value: 'sling', label: 'Sling' },
		{ value: 'brace', label: 'Brace' },
		{ value: 'splint', label: 'Splint' },
		{ value: 'cane', label: 'Cane' },
		{ value: 'crutches', label: 'Crutches' },
		{ value: 'walker', label: 'Walker' },
		{ value: 'wheelchair', label: 'Wheelchair' },
		{ value: 'none', label: 'None' }
	];

	function toggleAdl(val: string) {
		if (fl.difficultyWithADLs.includes(val)) {
			fl.difficultyWithADLs = fl.difficultyWithADLs.filter((v) => v !== val);
		} else {
			fl.difficultyWithADLs = [...fl.difficultyWithADLs, val];
		}
	}
	function toggleAid(val: string) {
		if (fl.mobilityAids.includes(val)) {
			fl.mobilityAids = fl.mobilityAids.filter((v) => v !== val);
		} else {
			fl.mobilityAids = [...fl.mobilityAids, val];
		}
	}
</script>

<Fieldset legend="Functional Limitations">
	<p class="hint">Describe how your condition affects your daily activities.</p>

	<Field label="Difficulty with Activities of Daily Living">
		<CheckboxGroup label="Difficulty with ADLs">
			{#each adlOptions as opt (opt.value)}
				<label>
					<input
						type="checkbox"
						class="checkbox-input"
						checked={fl.difficultyWithADLs.includes(opt.value)}
						onchange={() => toggleAdl(opt.value)}
					/>
					{opt.label}
				</label>
			{/each}
		</CheckboxGroup>
	</Field>

	<Field label="Mobility Aids Currently Used">
		<CheckboxGroup label="Mobility Aids">
			{#each aidOptions as opt (opt.value)}
				<label>
					<input
						type="checkbox"
						class="checkbox-input"
						checked={fl.mobilityAids.includes(opt.value)}
						onchange={() => toggleAid(opt.value)}
					/>
					{opt.label}
				</label>
			{/each}
		</CheckboxGroup>
	</Field>

	<Field label="Work Restrictions" inputId="workRestrictions">
		<TextAreaInput id="workRestrictions" label="Work Restrictions" rows={3} bind:value={fl.workRestrictions} />
	</Field>

	<Field label="Sport/Recreation Restrictions" inputId="sportRestrictions">
		<TextAreaInput id="sportRestrictions" label="Sport Restrictions" rows={3} bind:value={fl.sportRestrictions} />
	</Field>
</Fieldset>
