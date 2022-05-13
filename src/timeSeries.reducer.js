export const timeSeriesReducer = (state, action) => {
  switch (action.type) {
    case "next":
      return {
        ...state,
        page: state.page + 1,
      };
    case "prev":
      return {
        ...state,
        page: state.page - 1,
      };
    case "setPage":
      return {
        ...state,
        page: action.payload - 1,
      };
    case "setLength":
      return { ...state, plength: action.payload };
    default:
      return state;
  }
};
