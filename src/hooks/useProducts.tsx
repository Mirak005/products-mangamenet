import { useState, useEffect, useCallback } from 'react'

import { getProducts } from '../services/productApi'

import { IProduct } from '../types'

type State = [
  IProduct[],
  boolean,
  boolean,
  number,
  (start?: number) => Promise<number>
]

const useProducts = (): State => {
  const [data, setData] = useState<IProduct[]>([])
  const [total, setTotal] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const loadProducts = useCallback(async (start: number = 0) => {
    try {
      const { products, count } = await getProducts(start)
      setData((prevState) => [...prevState, ...products])
      setIsLoading(false)
      return count
    } catch (error) {
      setIsLoading(false)
      setHasError(true)
      return 0
    }
  }, [])

  useEffect(() => {
    if (total === 0) {
      loadProducts().then((totalCount) => setTotal(totalCount))
    }
  }, [loadProducts, total])

  return [data, isLoading, hasError, total, loadProducts]
}

export default useProducts
