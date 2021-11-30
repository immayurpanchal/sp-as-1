/* eslint-disable no-console */
import { useCallback, useEffect, useState } from 'react'
import { mockPlaces } from '../utils/mockData'

const useGooglePlace = location => {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(false)

  const handlePlaceSearch = useCallback(() => {
    setLoading(true)
    // Mock API call to fetch the Google Plus API response
    setTimeout(() => {
      setLoading(false)
      setPlaces(mockPlaces)
    }, 500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  useEffect(handlePlaceSearch, [handlePlaceSearch])

  // As it is a mock api, it'll never throw an error
  // hence return error:null
  return {
    places,
    loading,
    error: null,
    handlePlaceSearch
  }
}

export default useGooglePlace
