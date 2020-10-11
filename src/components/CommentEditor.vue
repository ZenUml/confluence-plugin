<template>
  <div v-show="isEditing">
    <TextArea ref="textareaEl" resize="auto" name="area" isInvalid isCompact />
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
    methods: {
      onRef: function () {
        // eslint-disable-next-line
        console.log(arguments)
      }
    },
    mounted: function() {
      // eslint-disable-next-line
      console.log(this.$refs)
    },
    components: {
      TextArea
    }
  }
</script>