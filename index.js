import React, { useCallback, useState } from 'react'

function useDataLoader(loadingFunction) {
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [data, setData] = useState([]);
    const [pageData, setPageData] = useState({});

    const load = useCallback(async function ({ page = 1, limit = 20, ...otherQuery } = {}, requestOptions = {}) {
        setLoading(true);
        try {
            const res = await loadingFunction({ page, limit, ...otherQuery }, requestOptions);
            setData(res?.data || []);
            setPageData(res?.page || {});
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    }, [loadingFunction])

    const loadMore = useCallback(async function (query = {}, requestOptions = {}) {
        setLoadingMore(true);
        const res = await loadingFunction({ page: pageData.page + 1, limit: pageData.limit, ...query }, requestOptions)
        setData(prev => {
            return [...prev, res?.data]
        })
        setPageData(res?.page || []);
        setLoadingMore(false);
    }, [loadingFunction, pageData.limit, pageData.page])

    return {
        loading,
        loadingMore,
        data,
        pageData,
        load,
        loadMore
    }
}

export default useDataLoader