<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Alert from './Alert.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Alert',
    component: Alert,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <p>This is an alert message.</p>
</Story>
