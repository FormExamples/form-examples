<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import InputGroup from './InputGroup.svelte';

  const { Story } = defineMeta({
    title: 'Headless/InputGroup',
    component: InputGroup,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ label: 'Amount' }}
>
  <input type="number" />
</Story>
