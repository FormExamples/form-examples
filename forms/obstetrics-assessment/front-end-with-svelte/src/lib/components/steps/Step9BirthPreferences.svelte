<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const b = assessment.data.birthPreferences;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Birth Preferences">
	<p class="hint">Patient-led preferences for place, pain relief, and feeding.</p>

	<Field label="Preferred place of birth" inputId="preferredBirthSetting">
		<Select id="preferredBirthSetting" label="Preferred place of birth" bind:value={b.preferredBirthSetting}>
			<option value="">— Select —</option>
			<option value="home">Home birth</option>
			<option value="midwife-led-unit">Midwife-led unit</option>
			<option value="obstetric-unit">Obstetric unit (hospital)</option>
			<option value="undecided">Undecided</option>
		</Select>
	</Field>

	<Field label="Preferred analgesia" inputId="preferredAnalgesia">
		<Select id="preferredAnalgesia" label="Preferred analgesia" bind:value={b.preferredAnalgesia}>
			<option value="">— Select —</option>
			<option value="none">None / hypnobirthing</option>
			<option value="gas-air">Entonox (gas and air)</option>
			<option value="pethidine">Opioids (pethidine / diamorphine)</option>
			<option value="epidural">Epidural</option>
			<option value="undecided">Undecided</option>
		</Select>
	</Field>

	<Field label="Birth partner planned?">
		<RadioGroup label="Birth partner planned?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="birthPartnerPlanned" value={opt.value} bind:group={b.birthPartnerPlanned} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Written birth plan completed?">
		<RadioGroup label="Written birth plan completed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="birthPlanCompleted" value={opt.value} bind:group={b.birthPlanCompleted} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Plans to breastfeed?">
		<RadioGroup label="Plans to breastfeed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="feedingChoiceBreast" value={opt.value} bind:group={b.feedingChoiceBreast} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Plans to formula feed?">
		<RadioGroup label="Plans to formula feed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="feedingChoiceFormula" value={opt.value} bind:group={b.feedingChoiceFormula} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="VBAC (vaginal birth after caesarean) requested?">
		<RadioGroup label="VBAC requested?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="vbacRequested" value={opt.value} bind:group={b.vbacRequested} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Other birth preferences" inputId="birthPreferenceNotes">
		<TextAreaInput id="birthPreferenceNotes" label="Other birth preferences" rows={3} placeholder="Other preferences (lighting, music, water birth, religious or cultural needs, etc.)" bind:value={b.birthPreferenceNotes} />
	</Field>
</Fieldset>
