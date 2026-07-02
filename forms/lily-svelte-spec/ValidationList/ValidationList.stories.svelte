<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ValidationList from './ValidationList.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ValidationList',
    component: ValidationList,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ label: 'Password requirements' }}
>
  <li data-status="passed">At least 8 characters</li>
  <li data-status="pending">One uppercase letter</li>
  <li data-status="failed">One number</li>
</Story>
