<template>
  <span v-text="timestamp"></span>
</template>
<script>
  import moment from 'moment'
  import { dateDiffFromNow, } from 'src/util/comm'
  import { get, } from 'lodash'

  export default {
    name: 'Timestamp',
    data () {
      return {
        timestamp: dateDiffFromNow(this.datetime)
      }
    },
    methods: {},
    mounted () {
      setInterval(() => {
        this.timestamp = dateDiffFromNow(this.datetime)
      }, 60000)
    },
    props: {
      datetime: {
        type: String,
        default: () => moment().format('YYYY-MM-DD HH:mm:ss')
      },
    },
    watch: {
      datetime () {
        this.timestamp = dateDiffFromNow(this.datetime)
      }
    },
  }
</script>
