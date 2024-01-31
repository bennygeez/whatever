export const fetchAddress = async (latitude, longitude) => {
  // Use OpenStreetMap Nominatim API for reverse geocoding
  const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`

  try {
    const response = await fetch(apiUrl)
    console.log("🚀 ~ fetchAddress ~ response:", response)
    const data = await response.json()
    console.log("🚀 ~ fetchAddress ~ data:", data)

    if (data.address) {
      const formattedAddress = `${
        data?.address?.state ? data?.address?.state : data?.address?.province || ''
      } ${data?.address?.country || ''} ${
        data?.address?.city ? data?.address?.city : data?.address?.county || ''
      } `
      return formattedAddress
    }
  } catch (error) {
    console.error('Error fetching address:', error)
  }
}
