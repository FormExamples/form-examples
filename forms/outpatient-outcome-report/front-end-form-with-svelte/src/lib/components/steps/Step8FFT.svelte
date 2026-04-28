<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const d = assessment.data.premFft;
</script>

<SectionCard title="PREM — Friends & Family Test" description="NHS Friends and Family Test (FFT). Open Government Licence v3.0. NHS England.">

	<p class="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
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

	<TextArea
		label="Please tell us why you gave this response (optional)"
		name="fftComment"
		bind:value={d.fftComment}
		placeholder="Your comments help us to improve our services"
		rows={3}
	/>
</SectionCard>
