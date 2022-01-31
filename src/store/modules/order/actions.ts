import { ActionTree } from 'vuex'
import RootState from '@/store/RootState'
import OrderState from './OrderState'
import emitter from '@/event-bus'
import { OrderService } from '@/services/OrderService'
import { hasError, showToast } from '@/utils'
import { translate } from '@/i18n'
import * as types from './mutation-types'


const actions: ActionTree<OrderState, RootState> = {

  // get in progress orders
  async fetchInProgressOrders ({ commit }, payload) {
    emitter.emit('presentLoader');
    let resp;

    try {
      resp = await OrderService.fetchInProgressOrders(payload);
      if (resp.status === 200 && resp.data.docs.length > 0 && !hasError(resp)) {
        commit(types.ORDER_IN_PROGRESS_UPDATED, resp.data.docs)
      } else {
        showToast(translate('Something went wrong'))
      }
    } catch (err) {
      showToast(translate('Something went wrong'))
    }
    return resp;
  }

}

export default actions;