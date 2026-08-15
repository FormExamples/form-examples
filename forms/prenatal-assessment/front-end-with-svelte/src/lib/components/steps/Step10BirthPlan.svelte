<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const b = assessment.data.birthPlanPreferences;

	const deliveryOptions = [
		{ value: 'vaginal', label: 'Vaginal delivery' },
		{ value: 'water-birth', label: 'Water birth' },
		{ value: 'home-birth', label: 'Home birth' },
		{ value: 'elective-cesarean', label: 'Elective cesarean section' },
		{ value: 'vbac', label: 'VBAC (Vaginal birth after cesarean)' },
		{ value: 'no-preference', label: 'No preference' }
	];
	const painOptions = [
		{ value: 'natural', label: 'Natural / No pain relief' },
		{ value: 'gas-air', label: 'Gas and air (Entonox)' },
		{ value: 'pethidine', label: 'Pethidine / Diamorphine' },
		{ value: 'epidural', label: 'Epidural' },
		{ value: 'tens', label: 'TENS machine' },
		{ value: 'combination', label: 'Open to a combination' },
		{ value: 'undecided', label: 'Undecided' }
	];
	const feedingOptions = [
		{ value: 'breastfeeding', label: 'Breastfeeding' },
		{ value: 'formula', label: 'Formula feeding' },
		{ value: 'combination', label: 'Combination feeding' },
		{ value: 'undecided', label: 'Undecided' }
	];
</script>

<Fieldset legend="Birth Plan Preferences">
	<p class="hint">Your preferences for labour, delivery, and postnatal care.</p>

	<Field label="Delivery Preference" inputId="deliveryPreference">
		<Select id="deliveryPreference" label="Delivery preference" bind:value={b.deliveryPreference}>
			<option value="">-- Select --</option>
			{#each deliveryOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Pain Management" inputId="painManagement">
		<Select id="painManagement" label="Pain management" bind:value={b.painManagement}>
			<option value="">-- Select --</option>
			{#each painOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Feeding Plan" inputId="feedingPlan">
		<Select id="feedingPlan" label="Feeding plan" bind:value={b.feedingPlan}>
			<option value="">-- Select --</option>
			{#each feedingOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>

	<Field label="Special Requests or Notes" inputId="specialRequests">
		<TextAreaInput id="specialRequests" label="Special requests" rows={4} bind:value={b.specialRequests} />
	</Field>
</Fieldset>
