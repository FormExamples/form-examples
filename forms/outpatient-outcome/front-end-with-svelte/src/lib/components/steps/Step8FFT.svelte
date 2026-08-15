<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.premFft;
</script>

<Fieldset title="PREM — Friends & Family Test" description="NHS Friends and Family Test (FFT). Open Government Licence v3.0. NHS England.">

	<p class="mb-4 rounded-lg border border-info/40 bg-info/10 px-4 py-3 text-sm text-info">
		Overall, how likely are you to recommend our service to friends and family if they needed similar
		care or treatment?
	</p>

	<RadioGroup
		label="How likely are you to recommend this service?"
		name="fftResponse"
		options={[
			{ value: 'extremely_likely', label: 'Extremely likely' },
			{ value: 'likely', label: 'Likely' },
			{ value: 'neither', label: 'Neither likely nor unlikely' },
			{ value: 'unlikely', label: 'Unlikely' },
			{ value: 'extremely_unlikely', label: 'Extremely unlikely' },
			{ value: 'dont_know', label: "Don't know" }
		]}
		bind:value={d.fftResponse}
	/>

	<TextAreaInput
		label="Please tell us why you gave this response (optional)"
		name="fftComment"
		bind:value={d.fftComment}
		placeholder="Your comments help us to improve our services"
		rows={3}
	/>
</Fieldset>
