<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const cv = assessment.data.cardiovascularGenetics;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset title="Cardiovascular Genetics" description="Family history of inherited cardiovascular conditions">
	<RadioGroup label="Is there a family history of familial hypercholesterolemia?" name="familialHypercholesterolemia" options={yesNo} bind:value={cv.familialHypercholesterolemia} />

	<RadioGroup label="Is there a family history of cardiomyopathy?" name="cardiomyopathy" options={yesNo} bind:value={cv.cardiomyopathy} />

	<RadioGroup label="Is there a family history of aortic aneurysm?" name="aorticAneurysm" options={yesNo} bind:value={cv.aorticAneurysm} />

	<RadioGroup label="Is there a family history of sudden cardiac death (under age 50)?" name="suddenCardiacDeath" options={yesNo} bind:value={cv.suddenCardiacDeath} />

	<RadioGroup label="Is there a family history of early-onset cardiovascular disease (under age 55 in males, under 65 in females)?" name="earlyOnsetCVD" options={yesNo} bind:value={cv.earlyOnsetCVD} />

	<TextAreaInput
		label="Additional cardiovascular genetic details"
		name="cardiovascularDetails"
		bind:value={cv.cardiovascularDetails}
		placeholder="Provide any additional details about cardiovascular conditions in the family..."
	/>
</Fieldset>
