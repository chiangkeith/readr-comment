import Comment from './components/Comment.vue'

const Plugin = {
  install (Vue) {
    if (this.installed) {
      return
    }
    this.installed = true
    Vue.component(Comment.name, Comment)
  },
  version: process.env.VERSION
}

export default Plugin
export { Comment }
