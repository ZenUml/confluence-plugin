<template>
  <div v-show="isEditing">
    <TextArea resize="auto" name="area" isInvalid isCompact />
  </div>
</template>

<script>
  // import React from 'react'
  // import styled from 'styled-components'
  import TextArea from '@atlaskit/textarea'
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters(['isEditing'])
    },
    components: {
      TextArea
    }
  }
</script>