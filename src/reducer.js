export const initialState = {
  user: null,
  hideSidebar: null,
  isAppLoading: false,
};

export const actionTypes = {
  SET_USER: "SET_USER",
  handleSidebarType: "HANDLE_SIDEBAR_TYPE",
  handleAppLoading: "HANDLE_APP_LOADING",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      state.user = action.user;
      return {
        ...state,
        user: state.user,
      };
    case actionTypes.handleSidebarType:
      state.hideSidebar = action.hideSidebar;
      return {
        ...state,
        hideSidebar: state.hideSidebar,
      };
    case actionTypes.handleAppLoading:
      state.isAppLoading = action.isAppLoading;
      return {
        ...state,
        isAppLoading: state.isAppLoading,
      };
    default:
      return state;
  }
};

export default reducer;
