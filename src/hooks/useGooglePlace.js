import { useEffect, useState } from 'react'

const useGooglePlace = () => {
  const [place, setPlace] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handlePlaceSearch = latLng => {
    console.log(
      'Doing nothing with request latLng in actual API we can get the address from lat and lng',
      latLng
    )
    setLoading(true)
    // Mock API call to fetch the Google Plus API response
    setTimeout(() => {
      setLoading(false)
      setPlace('SP, Ahemedabad, Gujarat, India')
    }, 500)
  }

  useEffect(() => {
    setError(false)
  }, [place])

  return {
    place,
    loading,
    error,
    handlePlaceSearch
  }
}

export default useGooglePlace
