interface RootState {
  status: {
    isLoading: boolean;
  };
}

interface ReducerAction {
  type: string;
  payload?: unknown;
}

export { RootState, ReducerAction };
