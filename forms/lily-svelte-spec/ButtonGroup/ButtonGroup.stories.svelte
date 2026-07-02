<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ButtonGroup from './ButtonGroup.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ButtonGroup',
    component: ButtonGroup,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ label: 'Edit actions' }}
>
  <button type="button">Save</button>
  <button type="button">Cancel</button>
</Story>
