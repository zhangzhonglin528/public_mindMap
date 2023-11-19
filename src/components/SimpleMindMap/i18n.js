import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from './lang'
import { getLang } from '@/components/SimpleMindMap/api'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: getLang(),
  messages
})

export default i18n
