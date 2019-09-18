```typescript
class AutocompleteController {
  /**
   * 每次用户输入任意值，都会从 payload$ 流中获得
   * 比如，用户依次输入 a, b, c
   * 那么 payload$ 流会获得三个值："a", "ab", "abc"
   */
  payload$: Subject<string>

  subscription: Subscription

  constructor() {
    // 除了此处的 .subscribe() 调用，其他地方都不应该调用 Observable/Subject 的 subscribe 方法
    this.subscription = this.getAutoSearch().subscribe()
  }

  // 更新 Input 框中的搜索词
  setSearchStr: (str: string) => void
  // 更新搜索状态
  setLoading: (isLoading: boolean) => void
  // 显示或隐藏警告信息
  toggleWarning: (isShown?: boolean) => void
  // 发送请求，获取搜索结果
  searchQuery: (str: string) => Observable<User[]>
  // 更新搜索结果列表
  setSearchResults: (users: User[]) => void

  // 你要实现的方法
  getAutoSearch() {
    const search$ = this.payload$
      .debounceTime(500)
      .map(event => (<HTMLInputElement>event.target).value)
      .filter(val => val !== '')
      .switchMap(this.searchQuery)
      .do((result: HttpResponse | null) => {
        if (result) {
          this.setSearchResults(result.users)
        }
      })
    return search$
  }
}
```
