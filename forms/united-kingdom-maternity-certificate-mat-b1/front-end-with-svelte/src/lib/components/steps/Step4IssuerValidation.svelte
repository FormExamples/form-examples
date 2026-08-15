<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';

	const issuer = assessment.data.issuer;
</script>

<Fieldset legend="Issuer Validation">
	<p class="hint">
		The MAT B1 must be signed by either a registered doctor or a registered
		midwife. Doctors apply a name-and-address stamp; midwives provide their
		NMC personal identification number and registration expiry date.
	</p>

	<Field label="Issuer type" required>
		<RadioGroup label="Issuer type">
			<label><input type="radio" class="radio-input" name="issuerType" value="doctor" bind:group={issuer.issuerType} /> Doctor</label>
			<label><input type="radio" class="radio-input" name="issuerType" value="midwife" bind:group={issuer.issuerType} /> Registered midwife</label>
		</RadioGroup>
	</Field>

	{#if issuer.issuerType === 'doctor'}
		<Alert type="info">
			<p>DWP guidance: doctors must apply their official name-and-address stamp to every MAT B1 they issue.</p>
		</Alert>

		<Field label="Doctor's name" required inputId="doctorName">
			<TextInput id="doctorName" label="Doctor's name" required bind:value={issuer.doctor.doctorName} />
		</Field>

		<Field label="Practice name" required inputId="practiceName">
			<TextInput id="practiceName" label="Practice name" required bind:value={issuer.doctor.practiceName} />
		</Field>

		<Field label="Practice address" inputId="practiceAddress">
			<TextAreaInput id="practiceAddress" label="Practice address" rows={2} bind:value={issuer.doctor.practiceAddress} />
		</Field>

		<Field label="Has the official name-and-address stamp been applied?" required>
			<RadioGroup label="Stamp applied">
				<label><input type="radio" class="radio-input" name="stampApplied" value="yes" bind:group={issuer.doctor.stampApplied} /> Yes</label>
				<label><input type="radio" class="radio-input" name="stampApplied" value="no" bind:group={issuer.doctor.stampApplied} /> No</label>
			</RadioGroup>
		</Field>
	{:else if issuer.issuerType === 'midwife'}
		<Alert type="info">
			<p>DWP guidance: registered midwives must record their NMC personal identification number (PIN) and the expiry date of their NMC registration on every MAT B1 they sign.</p>
		</Alert>

		<Field label="Midwife's full name" required inputId="midwifeName">
			<TextInput id="midwifeName" label="Midwife's full name" required bind:value={issuer.midwife.midwifeName} />
		</Field>

		<Field label="NMC personal identification number (PIN)" required inputId="nmcPin">
			<TextInput id="nmcPin" label="NMC PIN" required placeholder="e.g. 12A3456E" bind:value={issuer.midwife.nmcPin} />
		</Field>

		<Field label="NMC registration expiry date" required inputId="nmcExpiryDate">
			<DateInput id="nmcExpiryDate" label="NMC registration expiry date" required bind:value={issuer.midwife.nmcExpiryDate} />
		</Field>
	{:else}
		<p class="hint">Select an issuer type above to continue.</p>
	{/if}

	<Field label="Pre-printed unique certificate number" required inputId="certificateNumber" description="From the official MAT B1 form">
		<TextInput id="certificateNumber" label="Pre-printed unique certificate number" required bind:value={issuer.certificateNumber} />
	</Field>

	<Field label="Issue date (date the certificate is signed)" required inputId="issueDate">
		<DateInput id="issueDate" label="Issue date" required bind:value={issuer.issueDate} />
	</Field>

	<Field label="Is this certificate a duplicate replacement?">
		<RadioGroup label="Duplicate?">
			<label><input type="radio" class="radio-input" name="isDuplicate" value="yes" bind:group={issuer.isDuplicate} /> Yes</label>
			<label><input type="radio" class="radio-input" name="isDuplicate" value="no" bind:group={issuer.isDuplicate} /> No</label>
		</RadioGroup>
	</Field>

	{#if issuer.isDuplicate === 'yes'}
		<Field label={'Has the form been marked "DUPLICATE"?'} required>
			<RadioGroup label="Duplicate marker applied?">
				<label><input type="radio" class="radio-input" name="duplicateMarkerApplied" value="yes" bind:group={issuer.duplicateMarkerApplied} /> Yes</label>
				<label><input type="radio" class="radio-input" name="duplicateMarkerApplied" value="no" bind:group={issuer.duplicateMarkerApplied} /> No</label>
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Has the certificate been completed in ink (not pencil)?" required>
		<RadioGroup label="Completed in ink?">
			<label><input type="radio" class="radio-input" name="completedInInk" value="yes" bind:group={issuer.completedInInk} /> Yes</label>
			<label><input type="radio" class="radio-input" name="completedInInk" value="no" bind:group={issuer.completedInInk} /> No</label>
		</RadioGroup>
	</Field>
</Fieldset>
