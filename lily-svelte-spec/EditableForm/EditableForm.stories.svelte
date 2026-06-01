<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import EditableForm from './EditableForm.svelte';

  const { Story } = defineMeta({
    title: 'Headless/EditableForm',
    component: EditableForm,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Editable Form'}}
>
  <p>Form content</p>
</Story>
