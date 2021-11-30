import { useCallback, useEffect, useState } from 'react'
import { mockPlaces } from '../utils/mockData'

const useGooglePlace = () => {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handlePlaceSearch = useCallback(() => {
    setLoading(true)
    // Mock API call to fetch the Google Plus API response
    setTimeout(() => {
      setLoading(false)
      setPlaces(mockPlaces)
    }, 500)
  }, [])

  useEffect(() => {
    setError(false)
  }, [places])

  return {
    places,
    loading,
    error,
    handlePlaceSearch
  }
}

export default useGooglePlace
