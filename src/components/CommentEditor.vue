<template>
  <div v-show="isEditing">
    <Editor appearance="comment" />
  </div>
</template>

<script>
  // import React from 'react'
  // import styled from 'styled-components'
  import { Editor } from '@atlaskit/editor-core';
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
      Editor
    }
  }
</script>