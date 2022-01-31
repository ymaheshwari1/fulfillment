import { MutationTree } from 'vuex'
import PicklistState from './PicklistState'
import * as types from './mutation-types'

const mutations: MutationTree <PicklistState> = {
  [types.PICKLIST_SIZE] (state, payload) {
    state.size = payload;
  },
  [types.PICKLIST_PICKERS_UPDATED] (state, payload) {
    state.availablePickers = payload.pickers;
  }
}
export default mutations;