<script lang="ts">
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
</script>

<Fieldset legend="Step 2 — Research & Planning Privacy Notice">
  <p class="hint">
    How your confidential patient information is used for research and
    service planning, and your choices about this use.
  </p>

  <div class="notice-prose">
    <h3>Who we are and what we do</h3>
    <p>
      The NHS and organisations providing NHS services use confidential
      patient information to run the health service, plan services, and
      conduct research that benefits current and future patients. This
      notice explains how your information is used and the choices you
      have.
    </p>

    <h3>Legal bases</h3>
    <p>
      We process your information under <strong>UK GDPR Article 6(1)(e)</strong>
      (task in the public interest) and, for health data,
      <strong>Article 9(2)(h)</strong> (provision of health care) and, for
      research, <strong>Article 9(2)(j)</strong> (scientific research). The
      Common Law Duty of Confidentiality also applies.
    </p>

    <h3>What we use your information for</h3>
    <ul>
      <li>Direct care (always, and unrelated to the opt-out below)</li>
      <li>Service planning — measuring demand, waiting times, and outcomes</li>
      <li>Research — approved studies following Health Research Authority rules</li>
      <li>Quality assurance and audit</li>
      <li>Public-health surveillance (where legally required)</li>
    </ul>

    <h3>Your opt-out choices</h3>
    <p>You have two separate choices:</p>
    <ul>
      <li>
        <strong>Type 1 opt-out</strong> — asks your GP practice not to share
        your identifiable information from their records for purposes
        beyond direct care at that practice.
      </li>
      <li>
        <strong>NHS National Data Opt-Out</strong> — asks the NHS not to share
        your confidential patient information for research and planning
        across the wider NHS. You can set or change this at any time at
        <a href="https://www.nhs.uk/your-nhs-data-matters/" target="_blank" rel="noopener">nhs.uk/your-nhs-data-matters</a>.
      </li>
    </ul>

    <h3>Your rights</h3>
    <p>
      You have rights to access, correct, and (in some cases) object to or
      erase your personal data. You can complain to the Information
      Commissioner's Office at
      <a href="https://ico.org.uk/" target="_blank" rel="noopener">ico.org.uk</a>.
    </p>

    <p class="signoff-note">
      Please read each section carefully before proceeding to record your
      preferences, acknowledge, and sign.
    </p>
  </div>
</Fieldset>

<style>
  .notice-prose h3 {
    font-size: 1rem;
    font-weight: 600;
    margin: 1rem 0 0.25rem;
  }
  .notice-prose p { margin: 0 0 0.5rem; }
  .notice-prose ul { margin: 0 0 0.5rem 1.25rem; padding: 0; }
  .notice-prose a { color: var(--color-primary); text-decoration: underline; }
  .signoff-note {
    font-size: 0.875rem;
    color: var(--color-muted);
    margin-top: 1rem;
  }
</style>
