const Comments = require('./components/Comment.vue')
module.exports = Comments

Comments.install = Vue => Vue.component(Comments.name, Comments)
Comments.version = proccess.env.VERSION

// Install by default if using the script tag
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Comments)
}