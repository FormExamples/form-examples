<script lang="ts">
  import { store } from '#lib/stores/lpa.svelte.js';
  import Field from '#lib/components/ui/Field.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
  import CheckboxField from '#lib/components/ui/CheckboxField.svelte';
  import AddressInput from '#lib/components/ui/AddressInput.svelte';
  import SignaturePad from '#lib/components/ui/SignaturePad.svelte';

  // Ensure the certificate-provider record exists on the LPA.
  store.ensureCertificateProvider();
  const cp = $derived(store.data.certificateProvider!);

  // Ensure exactly one certificate-provider signature exists at LP1F section 10.
  function ensureCpSignature() {
    let sig = store.data.signatures.find(
      (s) => s.role === 'certificate_provider' && s.lp1fSection === 10,
    );
    if (!sig) {
      sig = {
        id: `sig-cp-${cp.person.id}`,
        signatoryPersonId: cp.person.id,
        role: 'certificate_provider',
        lp1fSection: 10,
        signatureBlobPath: '',
        signedOn: '',
        signedOnBehalfFullName: '',
        isWitnessed: false,
        witness: null,
      };
      store.data.signatures.push(sig);
    }
    return sig;
  }

  const cpSig = $derived(ensureCpSignature());

  const knowsDonorOptions = [
    { value: 'friend', label: 'A friend who has known the donor personally for at least 2 years' },
    { value: 'professional', label: 'A professional (GP, solicitor, registered social worker, etc.)' },
  ];
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 10 &mdash; Certificate provider (LP1F section 10)</h2>
  <p class="text-sm text-base-content/70 mb-3">
    The certificate provider confirms the donor understands the LPA and is not under pressure
    to make it. They must be independent of the donor and attorneys.
  </p>

  <div class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <Field label="Title">
        <TextInput bind:value={cp.person.title} placeholder="Mr / Mrs / Mx / Dr" />
      </Field>
      <Field label="First names">
        <TextInput bind:value={cp.person.firstNames} />
      </Field>
      <Field label="Last name">
        <TextInput bind:value={cp.person.lastName} />
      </Field>
      <Field label="Date of birth">
        <DateInput bind:value={cp.person.dateOfBirth} />
      </Field>
    </div>
    <AddressInput bind:address={cp.person.address} />

    <Field label="How the certificate provider knows the donor">
      <RadioGroup
        name="knowsDonorAs"
        options={knowsDonorOptions}
        bind:value={cp.knowsDonorAs}
      />
    </Field>

    <div class="space-y-1">
      <h3 class="text-sm font-semibold text-base-content/80">Eligibility confirmations</h3>
      <CheckboxField label="I am 18 or older." bind:checked={cp.isOverEighteen} />
      <CheckboxField
        label="I have read this LPA (or had it read to me) and discussed it with the donor."
        bind:checked={cp.readLpa}
      />
      <CheckboxField
        label="No one is forcing or pressuring the donor to make this LPA."
        bind:checked={cp.noRestrictionsOnActing}
      />
      <CheckboxField
        label="I am a family member of the donor or of one of the attorneys."
        bind:checked={cp.isRelatedToDonorOrAttorney}
      />
      <CheckboxField
        label="I own, manage, or am employed by the donor&rsquo;s care home."
        bind:checked={cp.isCareHomeOwnerOrEmployee}
      />
    </div>

    <SignaturePad bind:value={cpSig.signatureBlobPath} label="Certificate provider signature" />
    <Field label="Date signed">
      <DateInput bind:value={cpSig.signedOn} />
    </Field>
  </div>
</section>
