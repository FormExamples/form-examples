<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import InputWithMask from './InputWithMask.svelte';

  const { Story } = defineMeta({
    title: 'Headless/InputWithMask',
    component: InputWithMask,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    label: 'Phone number',
    mask: '(___) ___-____',
    value: '',
  }}
/>
