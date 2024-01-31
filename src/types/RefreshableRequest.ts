export type RefreshableRequest<T> =
  | RefreshableRequestWithoutData
  | RefreshableRequestWithData<T>

export type RefreshableRequestWithoutData =
  | { status: "Not Started" }
  | { status: "Loading" }
  | { status: "Load Error" }

export type RefreshableRequestWithData<T> =
  | { status: "Success"; data: T }
  | { status: "Refreshing"; data: T }
  | { status: "Refresh Error"; data: T }
