<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const s = assessment.data.symptomOverview;
</script>

<Fieldset legend="Symptom Overview">
	<p class="hint">General information about your symptoms and their impact.</p>

	<Field label="When did your symptoms first begin?" required inputId="onsetDate">
		<DateInput id="onsetDate" label="Onset date" required bind:value={s.onsetDate} />
	</Field>

	<Field label="How long have you had symptoms?" required inputId="symptomDuration">
		<TextInput
			id="symptomDuration"
			label="Symptom duration"
			required
			placeholder="e.g., 6 months, 2 years, since childhood"
			bind:value={s.symptomDuration}
		/>
	</Field>

	<Field label="How often do you experience symptoms?" required inputId="symptomFrequency">
		<Select id="symptomFrequency" label="Symptom frequency" required bind:value={s.symptomFrequency}>
			<option value="">-- Select --</option>
			<option value="rarely">Rarely (less than monthly)</option>
			<option value="sometimes">Sometimes (monthly)</option>
			<option value="often">Often (weekly)</option>
			<option value="daily">Daily</option>
		</Select>
	</Field>

	<Field label="How much do symptoms affect your quality of life?" required inputId="qualityOfLife">
		<Select id="qualityOfLife" label="Quality of life impact" required bind:value={s.qualityOfLife}>
			<option value="">-- Select --</option>
			<option value="none">No impact</option>
			<option value="mild">Mild impact - can manage daily activities</option>
			<option value="moderate">Moderate impact - some activities limited</option>
			<option value="severe">Severe impact - significantly limited</option>
		</Select>
	</Field>
</Fieldset>
