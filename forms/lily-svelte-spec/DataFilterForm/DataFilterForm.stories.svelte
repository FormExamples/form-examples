<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DataFilterForm from './DataFilterForm.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DataFilterForm',
    component: DataFilterForm,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Data Filter Form'}}
>
  <p>Form content</p>
</Story>
