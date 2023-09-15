export interface IUseSearchParams {
	search: string | null;
	filter?: {
		resource: string
	}
}

export interface IUseSearchCallbackParams {
	error?: Error | null;
	result?: any | null;
	loading: boolean;
}

// export const useSearch = (params: IUseSearchParams, func: Function, dependencies: any[]) => {
// 	const fetchDetail = useCallback(async () => {
// 		console.log('fetch detail')
// 		let param: IUseSearchCallbackParams
// 		if (!params || !params.search) {
// 			param = { error: new Error('Search keyword can not be empty'), loading: false }
// 			func(param)
// 			return
// 		}
// 		param = {result: null, loading: true}
// 		func(param)
// 		try {
// 			let endpoint = `/api/v1/search?text=${params.search}`
// 			if(params.filter?.resource) {
// 				endpoint = `${endpoint}&resource=${params.filter?.resource}`
// 			}
// 			const result = await axiosRequest('GET', endpoint, true);
// 			param = { result, loading: false }
// 			func(param)
// 		} catch (err: any) {
// 			param = { error: err, loading: false }
// 			func(param)
// 		}
// 	}, [params]);
// 	useEffect(() => {
// 		fetchDetail()
// 	}, [])
// }