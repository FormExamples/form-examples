<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AccordionCheckbox from './AccordionCheckbox.svelte';

  const { Story } = defineMeta({
    title: 'Headless/AccordionCheckbox',
    component: AccordionCheckbox,
  });
</script>

<Story
  name="Default"
  args={{ label: 'I have a follow-up question' }}
  tags={['autodocs', '!dev']}
>
  <p>Tell us more in the text-area-input below.</p>
  <textarea aria-label="Your question"></textarea>
</Story>

<Story
  name="InitiallyChecked"
  args={{ label: 'Subscribe to optional updates', checked: true }}
  tags={['autodocs', '!dev']}
>
  <p>Choose your topics below.</p>
</Story>
