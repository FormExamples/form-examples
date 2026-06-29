<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import LikertField from '$lib/components/ui/LikertField.svelte';

	const d = assessment.data.environmentFacilities;
</script>

<Fieldset legend="Environment & Facilities">
	<p class="hint">How would you rate the facilities?</p>

	<LikertField label="Cleanliness" name="cleanliness" bind:value={d.cleanliness} />
	<LikertField label="Comfort" name="comfort" bind:value={d.comfort} />
	<LikertField label="Noise levels" name="noiseLevels" bind:value={d.noiseLevels} />
	<LikertField label="Food quality" name="foodQuality" bind:value={d.foodQuality} />
	<LikertField label="Toilet / washroom facilities" name="toiletFacilities" bind:value={d.toiletFacilities} />
	<LikertField label="Temperature comfort" name="temperatureComfort" bind:value={d.temperatureComfort} />
</Fieldset>
