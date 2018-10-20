import { ACCORDION_TOGGLE, ACCORDION_OPEN } from '../actions/actionTypes';

const _defaultState = { details: {} };

const accordionReducer = (state = _defaultState, action) => {
  Object.freeze(state);

  let nextState;
  switch (action.type) {
    case ACCORDION_TOGGLE: {
      const { accordionType, accordionItem } = action;
      nextState = Object.assign({}, state);
      nextState[accordionType][accordionItem] = !nextState[accordionType][accordionItem];

      return nextState;
    }
    case ACCORDION_OPEN: {
      const { accordionType, accordionItem } = action;
      nextState = Object.assign({}, state);
      nextState[accordionType][accordionItem] = true;

      return nextState;
    }
    default:
      return state;
  }
};

export default accordionReducer;
