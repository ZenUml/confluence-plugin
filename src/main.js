import Vue from 'vue'
import Vuex from 'vuex'
import { VuePlugin } from 'vuera'
import VueCodeMirror from 'vue-codemirror'

import { Version, SeqDiagram, Store } from 'vue-sequence'
import 'vue-sequence/dist/vue-sequence.css'
// eslint-disable-next-line
console.log(Version)

import MockApConfluence from './utils/MockApConfluence'
import Macro from './utils/Macro'
import Comment from './utils/Comment'
import RemoteComment from './utils/RemoteComment'
import Editor from './components/Editor'
import Workspace from './components/Workspace'
import mermaid from 'mermaid'

import Va from 'vue-atlas'
import 'vue-atlas/dist/vue-atlas.css'

// Code Editor style
import 'codemirror/lib/codemirror.css'
// theme css
import 'codemirror/theme/base16-dark.css'

// eslint-disable-next-line
import React from 'react'
// import ReactDOM from 'react-dom'
import CommentComponent from './components/CommentComponent'

Vue.use(Va, 'en')
Vue.use(VuePlugin)

// eslint-disable-next-line
window.mermaid = mermaid

mermaid.mermaidAPI.initialize({
  startOnLoad:true
})

Vue.config.productionTip = false

Vue.component('seq-diagram', SeqDiagram)
Vue.component('editor', Editor)
Vue.component('workspace', Workspace)
Vue.use(VueCodeMirror)

Vue.use(Vuex)

const ExtendedStore = {
  ...Store,
  mutations: {
    ...Store.mutations,
    updateMermaidCode(state, payload) {
      state.mermaidCode = payload
    },
    updateMermaidDiagram(state, payload) {
      state.mermaidSvg = payload
    },
    updateDiagramType(state, payload) {
      state.diagramType = payload
    },
    updateCurrentCommentId(state, payload) {
      state.currentCommentId = payload
    }
  },
  actions: {
    ...Store.actions,
    updateMermaidCode({commit}, payload) {
      commit('updateMermaidCode', payload)
      try {
        mermaid.parse(payload);
        mermaid.mermaidAPI.render('any-id',
          payload,
          (svg) => {
            commit('updateMermaidDiagram', svg);
          }
        );
      } catch (e) {
        return false;
      }
    },
    updateDiagramType({commit}, payload) {
      commit('updateDiagramType', payload)
    },
    reloadZenUML({commit, state}) {
      const code = state.code
      commit('code', '')
      commit('code', code)
    },
    selectComment({commit}, payload) {
      commit('updateCurrentCommentId', payload)
    }
  },
  getters: {
    ...Store.getters,
    svg: (state) => {
      return state.mermaidSvg
    },
    diagramType: (state) => {
      return state.diagramType?.toLowerCase() || 'zenuml'
    },
    commentContent: (state) => {
      return state.commentContent
    }
  },
  state: {
    ...Store.state,
    mermaidCode: 'graph TD; A-->B;',
    mermaidSvg: '',
    diagramType: 'zenuml',
    styles: {},
    currentCommentId: '',
    commentContent: ''
  }
}

const store = new Vuex.Store(ExtendedStore);

new Vue({
  store,
  render: h => h(Workspace) // with this method, we don't need to use full version of vew
}).$mount('#app')
window.store = store

if (!window.AP) {
  // eslint-disable-next-line
  console.log('You are using a mocked AP.confluence')
  window.AP = {
    confluence: new MockApConfluence(),
    resize: () => {}
  }
}

window.Macro = Macro
window.Comment = Comment
window.RemoteComment = RemoteComment
if(window.onAppLoaded) {
  window.onAppLoaded();
}
// eslint-disable-next-line
console.log(CommentComponent)
store.state.commentContent = 'content from store'

new Vue({
  store,
  render: h => h(CommentComponent)
}).$mount('#comment')
// ReactDOM.render(React.createElement(CommentComponent), document.getElementById("comment"))