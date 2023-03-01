import { ActionTree } from 'vuex'
import RootState from '@/store/RootState'
import OrderState from './OrderState'
import emitter from '@/event-bus'
import { OrderService } from '@/services/OrderService'
import { hasError, showToast } from '@/utils'
import { translate } from '@/i18n'
import * as types from './mutation-types'
import { prepareOrderQuery } from '@/utils/solrHelper'


const actions: ActionTree<OrderState, RootState> = {

  // get in-progress orders
  async fetchInProgressOrders ({ commit }, payload) {
    emitter.emit('presentLoader');
    let resp;

    const orderQueryPayload = prepareOrderQuery({
      ...payload,
      queryFields: 'productId productName virtualProductName orderId search_orderIdentifications productSku customerId customerName goodIdentifications',
      sort: 'orderDate asc',
      groupBy: 'picklistBinId',
      filters: {
        picklistItemStatusId: { value: 'PICKITEM_PENDING' },
        '-fulfillmentStatus': { value: 'Rejected' },
        '-shipmentMethodTypeId': { value: 'STOREPICKUP' },
        facilityId: { value: this.state.user.currentFacility.facilityId }
      }
    })

    try {
      resp = await OrderService.fetchInProgressOrders(orderQueryPayload);
      console.log('resp', resp)
      if (resp.status === 200 && resp.data.grouped.picklistBinId.matches > 0 && !hasError(resp)) {
        const total = resp.data.grouped.picklistBinId.ngroups
        commit(types.ORDER_INPROGRESS_UPDATED, {inProgress: resp.data.grouped.picklistBinId.groups, total})
        this.dispatch('product/getProductInformation', {orders: resp.data.grouped.picklistBinId.groups})
      } else {
        console.error('No orders found')
      }
    } catch (err) {
      console.error('error', err)
      showToast(translate('Something went wrong'))
    }

    emitter.emit('dismissLoader');
    return resp;
  },

  async clearOrders ({ commit }) {
    commit(types.ORDER_INPROGRESS_UPDATED, {inProgress: {}, total: 0})
  }
}

export default actions;