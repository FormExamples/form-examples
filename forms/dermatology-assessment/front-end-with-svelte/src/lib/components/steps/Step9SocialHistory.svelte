<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.socialHistory;
</script>

<Fieldset legend="Social History">
	<p class="hint">Lifestyle factors relevant to skin health.</p>

	<Field label="Sun exposure level" inputId="sunExposure">
		<Select id="sunExposure" label="Sun exposure level" bind:value={s.sunExposure}>
			<option value="">-- Select --</option>
			<option value="minimal">Minimal (mostly indoors)</option>
			<option value="moderate">Moderate (some outdoor time)</option>
			<option value="frequent">Frequent (regular outdoor activities)</option>
			<option value="excessive">Excessive (prolonged daily exposure)</option>
		</Select>
	</Field>

	<Field label="Tanning history" inputId="tanningHistory">
		<Select id="tanningHistory" label="Tanning history" bind:value={s.tanningHistory}>
			<option value="">-- Select --</option>
			<option value="never">Never</option>
			<option value="occasional">Occasional outdoor tanning</option>
			<option value="regular-outdoor">Regular outdoor tanning</option>
			<option value="tanning-bed">Tanning bed use (current or past)</option>
		</Select>
	</Field>

	<Field label="Occupation" inputId="occupation">
		<TextInput id="occupation" label="Occupation" placeholder="e.g., outdoor worker, hairdresser, healthcare..." bind:value={s.occupation} />
	</Field>

	<Field label="Cosmetics and skincare products regularly used" inputId="cosmeticsUse">
		<TextAreaInput id="cosmeticsUse" label="Cosmetics use" rows={3} placeholder="List any cosmetics, skincare, or hair products you use regularly..." bind:value={s.cosmeticsUse} />
	</Field>
</Fieldset>
