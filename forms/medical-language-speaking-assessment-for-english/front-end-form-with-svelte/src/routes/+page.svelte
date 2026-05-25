<script lang="ts">
  // Lily Svelte headless contract — local shape-equivalent components.
  // Implementation pending; this is a Lily-shaped placeholder.
  import Form from '$lib/components/ui/Form.svelte';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import Field from '$lib/components/ui/Field.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Panel from '$lib/components/ui/Panel.svelte';
  import Alert from '$lib/components/ui/Alert.svelte';

  const title = 'Medical Language Speaking Assessment for English';
  const subtitle =
    'OET Medicine speaking sub-test \u2014 examiner form (implementation pending).';

  let candidateName = $state('');

  function onSubmit() {
    /* placeholder */
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<header class="page-header">
  <div class="page-header-inner">
    <h1>{title}</h1>
    <p class="subtitle">{subtitle}</p>
  </div>
</header>

<main>
  <div class="intro">
    <p>
      Clinical English-language speaking assessment for internationally educated
      healthcare professionals, modelled on the Occupational English Test (OET)
      Medicine speaking sub-test. Five-step examiner wizard.
    </p>
  </div>

  <Alert type="info" role="status">
    <p>
      Implementation pending. See the parent <a href="../../index.md">form
      specification</a>, <code>../plan.md</code>, and <code>../tasks.md</code>.
    </p>
  </Alert>

  <Form label={title} onsubmit={onSubmit}>
    <Fieldset legend="Candidate details (placeholder)">
      <Field label="Candidate name" inputId="candidateName">
        <TextInput id="candidateName" label="Candidate name" bind:value={candidateName} />
      </Field>
    </Fieldset>

    <div class="button-group">
      <Button type="submit" data-variant="primary">Submit</Button>
    </div>
  </Form>

  <Panel label="Assessment report">
    <p class="empty-message">
      Report rendering will be added when the engine and steps are implemented.
    </p>
  </Panel>
</main>
