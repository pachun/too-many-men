export type RefreshableRequest<T> =
  | RefreshableRequestWithoutData
  | RefreshableRequestWithData<T>

export type RefreshableRequestWithoutData =
  | { type: "Without Data"; status: "Not Started" }
  | { type: "Without Data"; status: "Loading" }
  | { type: "Without Data"; status: "Load Error" }

export type RefreshableRequestWithData<T> =
  | { type: "With Data"; status: "Success"; data: T }
  | { type: "With Data"; status: "Refreshing"; data: T }
  | { type: "With Data"; status: "Refresh Error"; data: T }
