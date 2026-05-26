<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const m = assessment.data.currentMedications;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Current Medications">
	<p class="hint">Antiplatelets, anticoagulants, beta-blockers, ACEi/ARBs, statins, diuretics.</p>

	<Field label="Are you taking antiplatelets (e.g. aspirin, clopidogrel)?">
		<RadioGroup label="Are you taking antiplatelets (e.g. aspirin, clopidogrel)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="antiplatelets" value={opt.value} bind:group={m.antiplatelets} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.antiplatelets === 'yes'}
		<Field label="Antiplatelet medication and dose" inputId="antiplateletType">
			<TextInput id="antiplateletType" label="Antiplatelet medication and dose" placeholder="e.g. Aspirin 75mg, Clopidogrel 75mg" bind:value={m.antiplateletType} />
		</Field>
	{/if}

	<Field label="Are you taking anticoagulants (e.g. warfarin, apixaban)?">
		<RadioGroup label="Are you taking anticoagulants (e.g. warfarin, apixaban)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="anticoagulants" value={opt.value} bind:group={m.anticoagulants} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.anticoagulants === 'yes'}
		<Field label="Anticoagulant medication and dose" inputId="anticoagulantType">
			<TextInput id="anticoagulantType" label="Anticoagulant medication and dose" placeholder="e.g. Warfarin, Apixaban 5mg BD" bind:value={m.anticoagulantType} />
		</Field>
	{/if}

	<Field label="Are you taking beta-blockers?">
		<RadioGroup label="Are you taking beta-blockers?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="betaBlockers" value={opt.value} bind:group={m.betaBlockers} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.betaBlockers === 'yes'}
		<Field label="Beta-blocker medication and dose" inputId="betaBlockerType">
			<TextInput id="betaBlockerType" label="Beta-blocker medication and dose" placeholder="e.g. Bisoprolol 5mg OD" bind:value={m.betaBlockerType} />
		</Field>
	{/if}

	<Field label="Are you taking ACE inhibitors or ARBs?">
		<RadioGroup label="Are you taking ACE inhibitors or ARBs?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="aceArbs" value={opt.value} bind:group={m.aceInhibitorsARBs} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.aceInhibitorsARBs === 'yes'}
		<Field label="ACEi/ARB medication and dose" inputId="aceArbType">
			<TextInput id="aceArbType" label="ACEi/ARB medication and dose" placeholder="e.g. Ramipril 5mg, Losartan 50mg" bind:value={m.aceArbType} />
		</Field>
	{/if}

	<Field label="Are you taking statins?">
		<RadioGroup label="Are you taking statins?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="statins" value={opt.value} bind:group={m.statins} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.statins === 'yes'}
		<Field label="Statin medication and dose" inputId="statinType">
			<TextInput id="statinType" label="Statin medication and dose" placeholder="e.g. Atorvastatin 40mg" bind:value={m.statinType} />
		</Field>
	{/if}

	<Field label="Are you taking diuretics?">
		<RadioGroup label="Are you taking diuretics?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="diuretics" value={opt.value} bind:group={m.diuretics} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if m.diuretics === 'yes'}
		<Field label="Diuretic medication and dose" inputId="diureticType">
			<TextInput id="diureticType" label="Diuretic medication and dose" placeholder="e.g. Furosemide 40mg" bind:value={m.diureticType} />
		</Field>
	{/if}

	<Field label="Other cardiac medications" inputId="otherCardiacMeds">
		<TextAreaInput id="otherCardiacMeds" label="Other cardiac medications" rows={3} placeholder="List any other cardiac medications" bind:value={m.otherCardiacMeds} />
	</Field>
</Fieldset>
