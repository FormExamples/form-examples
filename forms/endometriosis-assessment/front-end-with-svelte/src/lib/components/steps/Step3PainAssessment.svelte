<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const p = assessment.data.painAssessment;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Pain Assessment">
	<p class="hint">Character, location, timing, and severity of pelvic pain.</p>

	<Field label="Do you have pelvic pain?">
		<RadioGroup label="Do you have pelvic pain?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasPelvicPain" value={opt.value} bind:group={p.hasPelvicPain} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if p.hasPelvicPain === 'yes'}
		<Field label="Pelvic pain severity (VAS 0-10)" inputId="pelvicPainSeverity">
			<NumberInput id="pelvicPainSeverity" label="Pelvic pain severity" min={0} max={10} bind:value={p.pelvicPainSeverity} />
		</Field>

		<Field label="Pain character" inputId="pelvicPainCharacter">
			<Select id="pelvicPainCharacter" label="Pain character" bind:value={p.pelvicPainCharacter}>
				<option value="">-- Select --</option>
				<option value="cramping">Cramping</option>
				<option value="stabbing">Stabbing</option>
				<option value="burning">Burning</option>
				<option value="aching">Aching</option>
				<option value="dragging">Dragging</option>
				<option value="shooting">Shooting</option>
				<option value="other">Other</option>
			</Select>
		</Field>

		<Field label="Pain location" inputId="pelvicPainLocation">
			<Select id="pelvicPainLocation" label="Pain location" bind:value={p.pelvicPainLocation}>
				<option value="">-- Select --</option>
				<option value="central">Central</option>
				<option value="left-sided">Left-sided</option>
				<option value="right-sided">Right-sided</option>
				<option value="bilateral">Bilateral</option>
				<option value="diffuse">Diffuse</option>
				<option value="other">Other</option>
			</Select>
		</Field>

		<Field label="Pain timing" inputId="pelvicPainTiming">
			<Select id="pelvicPainTiming" label="Pain timing" bind:value={p.pelvicPainTiming}>
				<option value="">-- Select --</option>
				<option value="menstrual">Menstrual</option>
				<option value="premenstrual">Premenstrual</option>
				<option value="ovulatory">Ovulatory</option>
				<option value="constant">Constant</option>
				<option value="intermittent">Intermittent</option>
			</Select>
		</Field>
	{/if}

	<Field label="Dyspareunia (pain with intercourse)" inputId="dyspareunia">
		<Select id="dyspareunia" label="Dyspareunia" bind:value={p.dyspareunia}>
			<option value="">-- Select --</option>
			<option value="none">None</option>
			<option value="superficial">Superficial</option>
			<option value="deep">Deep</option>
			<option value="both">Both</option>
		</Select>
	</Field>

	{#if p.dyspareunia === 'deep' || p.dyspareunia === 'superficial' || p.dyspareunia === 'both'}
		<Field label="Dyspareunia severity (VAS 0-10)" inputId="dyspareuniaSeverity">
			<NumberInput id="dyspareuniaSeverity" label="Dyspareunia severity" min={0} max={10} bind:value={p.dyspareuniaSeverity} />
		</Field>
	{/if}

	<Field label="Dyschezia (painful defecation)?">
		<RadioGroup label="Dyschezia?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="dyschezia" value={opt.value} bind:group={p.dyschezia} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if p.dyschezia === 'yes'}
		<Field label="Is the dyschezia cyclical (worse during periods)?">
			<RadioGroup label="Cyclical dyschezia?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="dyscheziaCyclical" value={opt.value} bind:group={p.dyscheziaCyclical} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Back pain?">
		<RadioGroup label="Back pain?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="backPain" value={opt.value} bind:group={p.backPain} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Leg pain?">
		<RadioGroup label="Leg pain?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="legPain" value={opt.value} bind:group={p.legPain} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Pain worse with activity?">
		<RadioGroup label="Pain worse with activity?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="painWorseWithActivity" value={opt.value} bind:group={p.painWorseWithActivity} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Pain notes" inputId="painNotes">
		<TextAreaInput id="painNotes" label="Pain notes" rows={2} bind:value={p.painNotes} />
	</Field>
</Fieldset>
