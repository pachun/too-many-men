export interface ListComponentProps<Resource> {
  data: Resource[]
  isRefreshing: boolean
  onRefresh: () => Promise<void>
}

export type ListComponent<Resource> = (
  listComponentProps: ListComponentProps<Resource>,
) => React.ReactElement
