<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.chiefComplaint;

	const jointOptions = [
		'Shoulder', 'Elbow', 'Wrist', 'Hand', 'Hip', 'Knee', 'Ankle', 'Foot',
		'Spine - Cervical', 'Spine - Thoracic', 'Spine - Lumbar', 'Other'
	];
	const sideOptions = [
		{ value: 'left', label: 'Left' },
		{ value: 'right', label: 'Right' },
		{ value: 'bilateral', label: 'Bilateral' }
	];
	const onsetOptions = [
		{ value: 'acute', label: 'Acute' },
		{ value: 'gradual', label: 'Gradual' },
		{ value: 'traumatic', label: 'Traumatic' },
		{ value: 'overuse', label: 'Overuse' }
	];
	const aggravatingOptions = [
		{ value: 'movement', label: 'Movement' },
		{ value: 'weight-bearing', label: 'Weight bearing' },
		{ value: 'lifting', label: 'Lifting' },
		{ value: 'gripping', label: 'Gripping' },
		{ value: 'overhead-activity', label: 'Overhead activity' },
		{ value: 'prolonged-sitting', label: 'Prolonged sitting' },
		{ value: 'prolonged-standing', label: 'Prolonged standing' },
		{ value: 'swelling', label: 'Swelling' },
		{ value: 'redness', label: 'Redness' },
		{ value: 'cold-weather', label: 'Cold weather' }
	];

	function toggleAggravating(val: string) {
		if (c.aggravatingFactors.includes(val)) {
			c.aggravatingFactors = c.aggravatingFactors.filter((v) => v !== val);
		} else {
			c.aggravatingFactors = [...c.aggravatingFactors, val];
		}
	}
</script>

<Fieldset legend="Chief Complaint">
	<p class="hint">Describe your primary orthopedic concern.</p>

	<Field label="What is your primary concern?" inputId="primaryConcern">
		<TextAreaInput id="primaryConcern" label="Primary concern" rows={3} bind:value={c.primaryConcern} />
	</Field>

	<Field label="Affected Joint / Region" required inputId="affectedJoint">
		<Select id="affectedJoint" label="Affected Joint / Region" required bind:value={c.affectedJoint}>
			<option value="">-- Select --</option>
			{#each jointOptions as j}
				<option value={j}>{j}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Side" required>
		<RadioGroup label="Side">
			{#each sideOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="side" value={opt.value} bind:group={c.side} required />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Duration" required inputId="duration" description="e.g., 2 weeks, 3 months, 5 years">
		<TextInput id="duration" label="Duration" required bind:value={c.duration} />
	</Field>

	<Field label="Onset Type" required>
		<RadioGroup label="Onset Type">
			{#each onsetOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="onsetType" value={opt.value} bind:group={c.onsetType} required />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Aggravating Factors">
		<CheckboxGroup label="Aggravating Factors">
			{#each aggravatingOptions as opt (opt.value)}
				<label>
					<input
						type="checkbox"
						class="checkbox-input"
						checked={c.aggravatingFactors.includes(opt.value)}
						onchange={() => toggleAggravating(opt.value)}
					/>
					{opt.label}
				</label>
			{/each}
		</CheckboxGroup>
	</Field>
</Fieldset>
