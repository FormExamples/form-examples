<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Form from './Form.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Form',
    component: Form,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Form'}}
>
  <p>Form content</p>
</Story>
