import { ActionTypes } from '../config/constants';

export const subscribe = (payload) => {
	return {
		type: ActionTypes.BUDGETS_SUBSCRIBE,

	}
}

export const addItem = (item) => {
	return {
		type: ActionTypes.BUDGETS_ADD_ITEM,
		item,
	}
}

export const removeItem = (itemId) => {
	return {
		type: ActionTypes.BUDGETS_REMOVE_ITEM,
		itemId,
	}
}