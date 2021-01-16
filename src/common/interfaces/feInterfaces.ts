interface rootState {
  status: {
    isLoading: boolean;
  };
}

interface reducerAction {
  type: string;
  payload?: unknown;
}

export { rootState, reducerAction };
