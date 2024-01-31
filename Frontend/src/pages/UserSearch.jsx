// import React from 'react'

// const UserSearch = () => {
//   return (
//     <div>UserSearch</div>
//   )
// }

// export default UserSearch

import {
  Avatar,
  Col,
  Divider,
  Button,
  Image,
  Modal,
  Row,
  Skeleton,
  Slider,
  InputNumber,
  Select,
  Switch,
  Radio,
  Input,
  Popover,
  notification,
  Menu,
  Checkbox,
} from 'antd'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { MdKebabDining, MdOutlineWbIncandescent } from 'react-icons/md'
import { PiSlideshowBold } from 'react-icons/pi'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { imageBaseUrl } from '../config/constants'
import Layout from '../layout/Layout'
import {
  addClick,
  getAttachmentsByUserID,
  getNearestAttachments,
  getRecentAttachments,
} from '../services/Attachments'
import { getContacts } from '../services/chat'
import { blockUserProfile } from '../services/profile'
import { LOGIN } from '../redux/types/authTypes'
import { FaFilter, FaGlobeEurope } from 'react-icons/fa'
import FilterModal from '../components/FilterModal/FilterModal'
import { addReview, getALLusers, getReviews } from '../services/Reviews'
import { createRoot } from 'react-dom/client'
import { IoChatbubblesOutline } from 'react-icons/io5'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { fetchAddress } from '../constants/getAddress'
const UserSearch = () => {
  const chatSelector = useSelector((state) => state.chat)
  const [loading, setLoading] = useState(false)
  const [feed, setFeed] = useState([])
  const [popular, setPopular] = useState([])
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()
  // console.log('user :', user)
  // console.log('feed :', feed)

  // Assuming you have a state to manage the visibility of the modal
  const [videoModalVisible, setVideoModalVisible] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)

  // Function to handle click on video thumbnail
  const handleVideoThumbnailClick = (video) => {
    setSelectedVideo(video)
    setVideoModalVisible(true)
  }

  const [activeTab, setActiveTab] = useState('Recent')
  const navigate = useNavigate()

  useEffect(() => {
    getContacts()
    getFeedData()
  }, [])

  useEffect(() => {
    if (activeTab === 'Recent') getFeedData()
    else getNearest()
  }, [activeTab])

  const getFeedData = async () => {
    setLoading(true)
    let response = await getRecentAttachments()
    console.log({ response })
    if (response?.status === 200) {
      setLoading(false)

      setFeed(response?.data?.data)
    } else {
      setLoading(false)
    }
  }

  const getNearest = async () => {
    setLoading(true)
    let response = await getNearestAttachments()
    if (response?.status === 200) {
      setLoading(false)
      setPopular(response?.data)
    } else {
      setLoading(false)
    }
  }

  const handleNavigateToChat = (item) => {
    navigate(`/chat`, {
      state: {
        openChatWith: item,
      },
    })
  }
  const NoFeeds = () => {
    return (
      <div className='noFeeds'>
        <p>No Feeds Found</p>
      </div>
    )
  }

  const handleTabClick = (value) => {
    // console.log('🚀 ~ handleTabClick ~ value:', value)
    setActiveTab(value)
  }

  const onAttachmentClick = async (attachment) => {
    if (attachment?.createdBy) {
      if (localStorage.getItem('userId') !== attachment?.createdBy?._id) {
        await addClick(attachment?._id)
      }
    }
  }

  // components
  //    const [address,setAddress] = useState('')
  //     const currentAddress =  fetchAddress(latitude, longitude)

  //       setAddress(currentAddress)
  const [address, setAddress] = useState('')
  // console.log('🚀 ~ UserSearch ~ address:', address)

  const Card = ({ data, onClick }) => {
    const latitude = data?.location?.coordinates[1]
    // console.log('🚀 ~ Card ~ latitude:', latitude)
    const longitude = data?.location?.coordinates[0]
    // console.log('🚀 ~ Card ~ longitude:', longitude)

    const [location, setLocation] = useState('')
    console.log('🚀 ~ Card ~ location:', location)

    // useEffect(() => {
      const getLocation = async () => {
        try {
          const address = await fetchAddress(latitude, longitude);
          console.log("🚀 ~ getLocation ~ address:", address)
          setLocation(address);
        } catch (error) {
          console.error("Error fetching location:", error);
          // Handle the error as needed
        }
      };
      if (latitude && longitude) {
        getLocation();
      }
    // }, [latitude, longitude]);

    if (loading.length) {
      return <Skeleton active avatar style={{ margin: 10 }} />
    }
    const formatHour = (hour) => {
      if (hour >= 12) {
        return `${hour % 12} PM`
      } else {
        return `${hour} AM`
      }
    }
    return (
      <div className='card'>
        <div className='card-header-parent'>
          <div className='card-header'>
            <div className='avatar-container'>
              <Avatar src={data?.photo} size={50}></Avatar>
            </div>
            <div className='user-details'>
             

              
              <p className='user-location'>{location}</p>
              <p className='user-age'>{data?.age || 0} years old</p>
              <p className='user-gender'>{data?.gender}</p>
            </div>
          </div>
        </div>

        <div className='card-content'>
          <p className='hourly-label'>Hourly:</p>
          {data?.hourly?.map((hour, index) => (
            <div key={index} className='hourly-block'>
              <p className='hourly-value'>{formatHour(hour)} </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const SingleCard = ({ data, onClick }) => {
    // console.log({ data })
    if (loading) {
      return <Skeleton active avatar style={{ margin: 10 }} />
    }

    return (
      <div className='card single-card'>
        <div className='card-header'>
          <Avatar
            style={{ outline: '1px solid var(--gray300)' }}
            src={data?.createdBy?.photo ? `${imageBaseUrl}/${data?.createdBy?.photo}` : logo}
            size={50}
          ></Avatar>
          <div className='name-date'>
            <h2 className='userName'>{data?.createdBy?.name}</h2>
            {/* <p className='cardDate'>
                {moment(data?.attachments?.createdAt).format('DD MMM, YYYY')}
              </p> */}
            <div className='timeaGo'>
              {moment(data?.createdAt).isSame(moment(), 'day')
                ? moment(data?.createdAt).fromNow()
                : moment(data?.createdAt).format('DD MMM, YYYY')}
            </div>
          </div>
        </div>
        <div className='card-content'>
          {data?.type == 'photo' ? (
            <>
              <div>
                <Image
                  src={`${imageBaseUrl}/${data?.path}`}
                  width={'100%'}
                  height={'500px'}
                  style={{ objectFit: 'cover' }}
                  onClick={() => onClick(data)}
                />
                {/* <div style={{ display: 'flex', paddingTop: '5px' }}>
                    <p style={{ fontWeight: 'bold' }} className='timeaGo'>
                      {moment(data?.createdAt).isSame(moment(), 'day')
                        ? moment(data?.createdAt).fromNow()
                        : moment(data?.createdAt).format('DD MMM, YYYY')}
                    </p>
                  </div> */}
              </div>
            </>
          ) : (
            <>
              <div>
                <video
                  className='feedVideos'
                  src={`${imageBaseUrl}/${data?.path}`}
                  controls
                  onClick={() => {
                    // handleVideoThumbnailClick(data)
                    onClick(data)
                  }}
                />
                <div className='timeaGo'>
                  {moment(data?.createdAt).isSame(moment(), 'day')
                    ? moment(data?.createdAt).fromNow()
                    : moment(data?.createdAt).format('DD MMM, YYYY')}
                </div>
              </div>
            </>
          )}

          {/* Ant Design Modal for Videos */}
          <Modal
            title=''
            open={videoModalVisible}
            onCancel={() => setVideoModalVisible(false)}
            footer={null}
            centered
          >
            {selectedVideo && (
              <video controls width='100%' height='400px'>
                <source src={`${imageBaseUrl}/${selectedVideo.path}`} />
                Your browser does not support the video tag.
              </video>
            )}
          </Modal>
        </div>
      </div>
    )
  }

  // Filter Modal Handlers

  const [city, setCity] = useState('')
  const [ageRange, setAgeRange] = useState([18, 99])
  const [gender, setGender] = useState('')
  const [hourlyRange, setHourlyRange] = useState([0, 24])
  const [hostAvailable, setHostAvailable] = useState(false)
  const [selectedEthnicities, setSelectedEthnicities] = useState('')
  const [sexualOrientation, setSexualOrientation] = useState('')
  const [bodyRating, setBodyRating] = useState(0)
  const [assSize, setAssSize] = useState('')
  const [bodyType, setBodyType] = useState('')
  const [bondage, setBondage] = useState(false)
  const [breastCupSize, setBreastCupSize] = useState('')
  const [doublePenetration, setDoublePenetration] = useState(false)
  const [events, setEvents] = useState(false)
  const [footjob, setFootjob] = useState(false)
  const [hairColor, setHairColor] = useState('')
  const [feet, setFeet] = useState(0)
  const [inches, setInches] = useState(0)
  const [languages, setLanguages] = useState([])
  const [oral, setOral] = useState(false)
  const [weight, setWeight] = useState(0)
  const [orgies, setOrgies] = useState(false)
  const [penisGirth, setPenisGirth] = useState(0)
  const [penisSize, setPenisSize] = useState(0)
  const [threesome, seThreesome] = useState(0)
  const [useToys, setUseToys] = useState(false)
  const [roleplay, setRoleplay] = useState(false)


  const profiles = feed
  // console.log("🚀 ~ Feed ~ profiles:", profiles)

  // Assume this function is inside your React component

  const [finalFilterData, setFinalFilterData] = useState([])
  // console.log('🚀 ~ Feed ~ finalFilterData:', finalFilterData)

  // const handleFilterModalOk = () => {
  //   const filteredProfiles = profiles.filter((profile) => {
      // console.log('City Check:', profile.city?.toLowerCase().includes(city?.trim().toLowerCase()))
      // console.log('Age Range Check:', profile.age >= ageRange[0] || profile.age <= ageRange[1])
  //     const filterConditions = [
  //       {
  //         condition: city,
  //         check: (profile) => profile.city?.toLowerCase().includes(city?.toLowerCase() ?? ''),
  //       },
  //       // { condition: ageRange, check: (profile) => profile.age >= ageRange[0] || profile.age <= ageRange[1] },
  //       // { condition: gender, check: (profile) => profile.gender.toLowerCase() === gender.toLowerCase() },
  //       // { condition: hourlyRange, check: (profile) => profile.hourly[0] >= hourlyRange[0] || profile.hourly[1] <= hourlyRange[1] },
  //       // { condition: hostAvailable !== null, check: (profile) => profile.hostAvailable === hostAvailable },
  //       // { condition: selectedEthnicities, check: (profile) => selectedEthnicities.toLowerCase() === profile.selectedEthnicities.toLowerCase() },
  //       // { condition: sexualOrientation, check: (profile) => sexualOrientation.toLowerCase() === profile.sexualOrientation.toLowerCase() },
  //       // { condition: bodyRating !== null, check: (profile) => profile.bodyRating >= bodyRating },
  //       // { condition: assSize, check: (profile) => profile.assSize.toLowerCase() === assSize.toLowerCase() },
  //       // { condition: bodyType, check: (profile) => profile.bodyType.toLowerCase() === bodyType.toLowerCase() },
  //       // { condition: bondage !== null, check: (profile) => profile.bondage === bondage },
  //       // { condition: breastCupSize !== null, check: (profile) => profile.breastCupSize === breastCupSize },
  //       // { condition: doublePenetration !== null, check: (profile) => profile.doublePenetration === doublePenetration },
  //       // { condition: events !== null, check: (profile) => profile.events === events },
  //       // { condition: footjob !== null, check: (profile) => profile.footjob === footjob },
  //       // { condition: hairColor, check: (profile) => profile.hairColor.toLowerCase() === hairColor.toLowerCase() },
  //       // { condition: height !== null, check: (profile) => profile.height === height },
  //       // { condition: languages, check: (profile) => profile.languages.toLowerCase() === languages.toLowerCase() },
  //       // { condition: oral !== null, check: (profile) => profile.oral === oral },
  //       // { condition: weight !== null, check: (profile) => profile.weight === weight },
  //       // { condition: orgies !== null, check: (profile) => profile.orgies === orgies },
  //       // { condition: penisGirth !== null, check: (profile) => profile.penisGirth === penisGirth },
  //       // { condition: penisSize !== null, check: (profile) => profile.penisSize === penisSize },
  //       // { condition: threesome !== null, check: (profile) => profile.threesome === threesome },
  //       // { condition: useToys !== null, check: (profile) => profile.useToys === useToys },
  //       // { condition: roleplay !== null, check: (profile) => profile.roleplay === roleplay },
  //     ]

  //     // Return true if any filter conditions are satisfied, or if there are no filters
  //     return filterConditions.every(
  //       ({ condition, check }) => condition === undefined || check(profile),
  //     )
  //   })

  //   // Use the filteredProfiles array as needed
    // console.log('filteredProfiles', filteredProfiles)
  //   setFilterModalVisible(false)
  //   // Rest of your code
  // }

  const [filteredInput, setFilteredInput] = useState([])
  // console.log('🚀 ~ Feed ~ filteredInput:', filteredInput)
  const handleFilterModalOk = (e) => {
    let value = city.trim()
    let value1 = gender.trim()
    let value2 = ageRange
    let value3 = hourlyRange
    let value4 = sexualOrientation.trim()
    let value5 = bodyType.trim()
    let value6 = hairColor.trim()
    let value7 = languages

    if (!value || !value1) {
      // If all values are empty, reset the filters and show all profiles
      setFeed(profiles)
      setFilteredInput([])
      setCity('')
      setGender('')
      setAgeRange([18, 99])
      setHourlyRange([0, 24])
      setSexualOrientation('')
      setBodyType('')
      setHairColor('')
      setLanguages([])

      return
    }


    const filteredItems = profiles.filter((profile) => {
      const profileCity = profile.city
      const profileGender = profile.gender
      const profileAge = profile.age
      const profileHourly = profile.hourly
      const profileSexualOrientation = profile.sexualOrientation
      const profileBodyType = profile.bodyType
      const profileHairColor = profile.hairColor
      // const profileLanguages = profile.languages

      if (profileCity && typeof profileCity === 'string') {
        const cityMatch = profileCity.toLowerCase().includes(value.toLowerCase())
        const genderMatch =
          profileGender && profileGender.toLowerCase().includes(value1.toLowerCase())
        const ageMatch = profileAge >= value2[0] && profileAge <= value2[1]
        const hourlyMatch = profileHourly[0] >= value3[0] && profileHourly[1] <= value3[1]
        const sexualOrientationMatch =
          profileSexualOrientation &&
          profileSexualOrientation.toLowerCase().includes(value4.toLowerCase())
        const bodyTypeMatch =
          profileBodyType && profileBodyType.toLowerCase().includes(value5.toLowerCase())
        const hairColorMatch =
          profileHairColor && profileHairColor.toLowerCase().includes(value6.toLowerCase())
        // const languagesMatch =
        //   profileLanguages && profileLanguages.toLowerCase().includes(value7.toLowerCase())

        return (
          cityMatch &&
          genderMatch &&
          ageMatch &&
          hourlyMatch &&
          sexualOrientationMatch &&
          bodyTypeMatch &&
          hairColorMatch 
          // languagesMatch
        )
      } else {
        return false
      }
    })

    if (filteredItems.length === 0) {
      setFilteredInput(['Record not found'])
      setFilterModalVisible(false)
    } else {
      setFilteredInput(filteredItems)
      setFilterModalVisible(false)

    }
  }
  useEffect(() => {
    setFeed(filteredInput)
  }, [filteredInput])

  const [filterModalVisible, setFilterModalVisible] = useState(false)

 const handleFilterModalCancel = () => {
    // Handle FilterModal cancel logic here
    setFilterModalVisible(false)
  } 

  // render map  after filter  an user Profile
  const mapRef = useRef(null)
  const [influencers, setInfluencers] = useState([])
  const [currentLocation, setCurrentLocation] = useState(null)
  const [reviews, setReviews] = useState([])
  const [selectedInfluencer, setSelectedInfluencer] = useState(null)
  const [allUsers, setAllUsers] = useState([])
  const [newReview, setNewReview] = useState('')
  // const [loading, setLoading] = useState(false)
  const [photosMedia, setPhotosMedia] = useState([])
  const [videosMedia, setVideosMedia] = useState([])
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [showMap, setShowMap] = useState(false)

  // const navigate = useNavigate()
  const ref = useRef()

  // const root = document.getElementById('root');
  // const rootInstance = createRoot(root);

  // const handleNavigateToChat = (item) => {
  //   navigate(`/chat`, {
  //     state: {
  //       openChatWith: item,
  //     },
  //   })
  // }
  const getReview = async (id) => {
    try {
      setLoading(true)
      const getReview = await getReviews(id)
      // console.log({ getReview })
      setReviews(getReview)
      setLoading(false)
    } catch (e) {
      // console.log({ e })
    }
  }
  const handleAddReview = async (e, id) => {
    e.preventDefault()
    // console.log({ id })
    const val = {
      givenTo: id,
      comments: newReview,
      rating: 5,
    }
    try {
      const add = await addReview(val)
      // console.log({ add })

      setNewReview('')
      await getReview(id)
    } catch (error) {
      console.error('Error adding review:', error)
    }
  }

  const clearReviews = () => {
    setReviews([])
    setSelectedInfluencer({})
  }
  const handleToggleReviews = async (influencer) => {
    setSelectedInfluencer((prevInfluencer) =>
      prevInfluencer && prevInfluencer.id === influencer.id ? null : influencer,
    )

    ref?.current?.open()
    await getReview(influencer?.id)
    await fetchAttchments(influencer?.id)
  }
  const fetchAttchments = async (id) => {
    try {
      const attachments = await getAttachmentsByUserID(id)
      // console.log({ attachments })
      if (attachments) {
        const photoAttachments = attachments.data.filter(
          (attachment) => attachment.type === 'photo',
        )
        // console.log('photoAttachments :', photoAttachments)
        setPhotosMedia(photoAttachments)
        const videoAttachments = attachments.data.filter(
          (attachment) => attachment.type === 'video',
        )
        setVideosMedia(videoAttachments)
      }
    } catch (error) {
      console.error('Error fetching profile data:', error)
    }
  }
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error getting current location:', error.message)
        },
      )
    } else {
      console.error('Geolocation is not supported by your browser')
    }
  }
  const currentLocationIcon = new L.Icon({
    iconUrl:
      'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })

  const influencerIcon = (profileImage) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<img src="${profileImage}" alt="Profile" style="width: 60px; height: 60px; border-radius: 50%;border: 3px solid rgb(18, 38, 71);">`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    })
  }
  const getUsers = async () => {
    try {
      const data = await getALLusers()
      // console.log('🚀 ~ file: Home.jsx:138 ~ getUsers ~ data:', data)
      setAllUsers(data)
    } catch (e) {
      // console.log({ e })
    }
  }
  const AllUsers = () => {
    const Influencers = allUsers
      .filter((item) => item?.location?.coordinates)
      .map((item, i) => ({
        id: item?._id,
        name: item?.name,
        email: item?.email,
        bio: item?.description,
        location: {
          latitude: item?.location.coordinates[1],
          longitude: item?.location.coordinates[0],
        },
        profileImage: item?.photo ? `${imageBaseUrl}/${item?.photo}` : logo,
        reviews: reviews,
      }))

    setInfluencers(Influencers.filter((val) => val?.id !== localStorage.getItem('userId')))
  }

  useEffect(() => {
    getUsers()
  }, [])

  useEffect(() => {
    AllUsers()
  }, [allUsers, reviews])

  useEffect(() => {
    if (!mapRef.current && influencers.length && showMap) {
      const map = L.map('map', {
        minZoom: 3,
        maxZoom: 12,
        zoomControl: false,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true,
        zoomSnap: 0.06,
      }).setView([-0.09, 51.505], 3)

      mapRef.current = map

      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current)

      L.tileLayer(
        // 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        // 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
        // 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        // 'https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png',
        // 'https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
      ).addTo(mapRef.current)

      const points = influencers.map((influencer) => [
        influencer?.location?.latitude,
        influencer?.location?.longitude,
      ])

      const heat = new L.heatLayer(points, {
        maxZoom: 9,
        max: 10000000,
        radius: 50,
        blur: 75,
        animate: true, // Enable animation for smoother transitions
      })

      heat.setOptions({ max: 0.0001 })

      heat.addTo(mapRef.current)

      // Handle map events
      // mapRef.current.on('zoomstart', () => {
      //   // Update heatmap options on zoom
      //   const zoom = mapRef.current.getZoom()
      //   heat.setLatLngs(points);
      //   heat.setOptions({
      //     radius:   50,
      //     blur:   75,
      //   })
      // })
      mapRef.current.on('zoom', () => {
        // Update heatmap options on zoom
        const zoom = mapRef.current.getZoom()
        heat.setLatLngs(points)
        heat.setOptions({
          radius: 50,
          blur: 75,
        })
      })

      mapRef.current.on('dragstart', () => {
        // Update heatmap options on map move
        const zoom = mapRef.current.getZoom()
        heat.setLatLngs(points)
        heat.setOptions({
          radius: 50,
          blur: 75,
        })
      })

      if (currentLocation) {
        L.marker([currentLocation.latitude, currentLocation.longitude], {
          icon: currentLocationIcon,
        })
          .addTo(mapRef.current)
          .bindPopup('Your Current Location')
      }

      influencers.forEach((influencer, index) => {
        const marker = L.marker([influencer?.location?.latitude, influencer?.location?.longitude], {
          icon: influencerIcon(influencer?.profileImage),
        })

        const popupContent = document.createElement('div')

        let container = null

        document.addEventListener('DOMContentLoaded', function (event) {
          if (!container) {
            container = document.getElementById('root1')
            const root = createRoot(container)
            root.render(
              <React.StrictMode>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={influencer?.profileImage ? influencer?.profileImage : logo} />

                    <h3 className='name' style={{ paddingLeft: '5px' }}>
                      {influencer?.name}

                      {/* <Tooltip
                    color='var(--primary)'
                    placement='rightTop'
                    title={`Chat with ${influencer?.name}`}
                   
                  > */}
                      <IoChatbubblesOutline
                        onClick={() => handleNavigateToChat(influencer)}
                        style={{
                          color: 'hotpink',
                          marginLeft: '10px',
                          cursor: 'pointer',
                        }}
                        size={20}
                      />
                      {/* </Tooltip> */}
                    </h3>
                  </div>

                  <div
                    style={{
                      marginTop: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Button
                      style={{
                        background: 'linear-gradient(to right,rgb(211, 96, 115), pink)',
                        color: 'white',
                        width: '100%',
                      }}
                      onClick={() =>
                        handleToggleReviews(influencer, influencer?.email, influencer?.bio)
                      }
                    >
                      Profile
                    </Button>
                  </div>
                </div>
                ,
              </React.StrictMode>,
            )
          }
        })
        popupContent, marker.bindPopup(popupContent)
        marker.addTo(mapRef.current)
      })
    }
  }, [influencers, influencerIcon, currentLocation, showMap])

  return (
    <Layout active={'usersearch'}>
      <div className='Feed' style={{ paddingTop: '60px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '74%',
          }}
        >
          <div className='chatBTNS'>
            <span
              className={`tablinks ${activeTab === 'Recent' ? 'active' : ''}`}
              onClick={() => handleTabClick('Recent')}
            >
              <span className='desktop-icon'>Recent</span>
              <span className='mobile-icon'>
                <MdOutlineWbIncandescent />
              </span>
            </span>

            <span
              className={`tablinks ${activeTab === 'Popular' ? 'active' : ''}`}
              onClick={() => handleTabClick('Popular')}
            >
              <span className='desktop-icon'>Popular</span>
              <span className='mobile-icon'>
                <PiSlideshowBold />
              </span>
            </span>
          </div>
          {/* <span
                className={`tablinks ${activeTab === 'Filters' ? 'active' : ''}`}
                // onClick={() => handleTabClick('Popular')}
              >
                <span className='desktop-icon'>Filters</span>
                <span className='mobile-icon'>
                  <FaFilter color='#004080'/>
                </span>
              </span> */}
          <div>
            <Button
              onClick={() => setFilterModalVisible(true)}
              type='primary'
              className='filterlinks'
              icon={<FaFilter />}
            >
              Filters
            </Button>
          </div>
        </div>
        {/* <FilterModal
          visible={filterModalVisible}
          onOk={handleFilterModalOk}
          onCancel={handleFilterModalCancel}
        /> */}

        <Modal
          title='Filters'
          visible={filterModalVisible}
          onOk={handleFilterModalOk}
          onCancel={handleFilterModalCancel}
          className='ant-modal-content'
          onDismiss={false}
          width={1000}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ color: 'white' }}>City:</label>
              <Input
                placeholder='Add city name'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{onFocus:{border: '1px solid'},border: '1px solid'}}
              />
            </div>

            <div>
              <label style={{ color: 'white' }}>Age:</label>
              <Slider
                range
                min={18}
                max={99}
                defaultValue={ageRange}
                onChange={(value) => setAgeRange(value)}
                style={{onFocus:{border: '1px solid'},border: '1px solid !important'}}
              />
              <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                <InputNumber
                  min={18}
                  max={99}
                  value={ageRange[0]}
                  onChange={(value) => setAgeRange([value, ageRange[1]])}
                />
                <InputNumber
                  min={18}
                  max={99}
                  value={ageRange[1]}
                  onChange={(value) => setAgeRange([ageRange[0], value])}
                />
              </div>
            </div>

            <div>
              <label style={{ color: 'white' }}>Gender:</label>
              <Select
                defaultValue={gender}
                style={{ width: '100%' }}
                onChange={(value) => setGender(value)}
                dropdownClassName='custom-dropdown'
              >
                <Radio value='female' style={{ color: 'white' }}>
                  Female
                </Radio>
                <Radio value='male'>Male</Radio>
                <Radio value='trans'>Trans</Radio>
              </Select>
            </div>

            <div>
              <label style={{ color: 'white' }}>Hourly (from - to):</label>
              <Slider
                range
                min={0}
                max={24}
                defaultValue={hourlyRange}
                onChange={(value) => setHourlyRange(value)}
              />
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <InputNumber
                  min={0}
                  max={24}
                  value={hourlyRange[0]}
                  onChange={(value) => setHourlyRange([value, hourlyRange[1]])}
                />
                <InputNumber
                  min={0}
                  max={24}
                  value={hourlyRange[1]}
                  onChange={(value) => setHourlyRange([hourlyRange[0], value])}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <label style={{ color: 'white' }}>Scene location (Host available):</label>
              <Switch checked={hostAvailable} onChange={(checked) => setHostAvailable(checked)} />
            </div>

            <div>
              <label style={{ color: 'white' }}>Ethnicity:</label>
              <Select
                // mode='multiple'
                placeholder='Select ethnicities'
                style={{ width: '100%' }}
                value={selectedEthnicities}
                onChange={(values) => setSelectedEthnicities(values)}
              >
                <Radio value='White'>White</Radio>
                <Radio value='ebony'>Ebony</Radio>
                <Radio value='Hispanic'>Hispanic</Radio>
                <Radio value='Asian'>Asian</Radio>
                <Radio value='middle eastern'>Middle Eastern</Radio>
                <Radio value='European'>European</Radio>
                <Radio value='German'>German</Radio>
                <Radio value='Indian'>Indian</Radio>
              </Select>
            </div>
            <div>
              <label htmlFor='' style={{ color: 'white' }}>
                Sexual:
              </label>
              <Select
                // mode='multiple'
                placeholder='Select sexual orientation'
                style={{ width: '100%', color: 'white' }}
                onChange={(values) => setSexualOrientation(values)}
                value={sexualOrientation}
              >
                <Radio value='straight'>Straight</Radio>
                <Radio value='gay'>gay</Radio>
                <Radio value='trans'>trans</Radio>
                <Radio value='bisexual'>bisexual</Radio>
              </Select>
            </div>
          </div>
          <div className='field-group'>
            <label style={{ color: 'white' }}>Body Rating (0-10):</label>
            <Slider
              min={0}
              max={10}
              value={bodyRating}
              marks={{
                0: '0',
                1: '1',
                2: '2',
                3: '3',
                4: '4',
                5: '5',
                6: '6',
                7: '7',
                8: '8',
                9: '9',
                10: '10',
              }}
              onChange={(value) => setBodyRating(value)}
            />
          </div>

          <div className='field-group'>
            <label style={{ color: 'white' }}>Ass Size:</label>
            <Select
              placeholder='Select ass size'
              style={{ width: '100%' }}
              value={assSize}
              onChange={(value) => setAssSize(value)}
            >
              <Select.Option value='small'>Small</Select.Option>
              <Select.Option value='medium'>Medium</Select.Option>
              <Select.Option value='big'>Big</Select.Option>
            </Select>
          </div>

          <div className='field-group'>
            <label style={{ color: 'white' }}>Body Type:</label>
            <Select
              placeholder='Select body type'
              style={{ width: '100%' }}
              value={bodyType}
              onChange={(value) => setBodyType(value)}
            >
              <Select.Option value='slim'>Slim</Select.Option>
              <Select.Option value='average'>Average</Select.Option>
              <Select.Option value='athletic'>Athletic</Select.Option>
              <Select.Option value='chubby'>Chubby</Select.Option>
              <Select.Option value='BBW'>BBW</Select.Option>
            </Select>
          </div>

          <div className='field-group'>
            <label style={{ color: 'white' }}>Hair Color:</label>
            <Select
              placeholder='Select hair color'
              style={{ width: '100%' }}
              value={hairColor}
              onChange={(value) => setHairColor(value)}
            >
              <Select.Option value='black'>Black</Select.Option>
              <Select.Option value='brown'>Brown</Select.Option>
              <Select.Option value='blond'>Blond</Select.Option>
              <Select.Option value='white'>White</Select.Option>
              <Select.Option value='gray'>Gray</Select.Option>
            </Select>
          </div>

          <div className='field-group'>
            <label style={{ color: 'white' }}>Breast Cup Size:</label>
            <Slider
              min={0}
              max={5}
              value={breastCupSize}
              marks={{ 0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'DD', 5: 'DD+' }}
              markerHeight={5}
              style={{ color: 'white' }}
              onChange={(value) => setBreastCupSize(value)}
            />
          </div>

          <div className='field-group'>
            <label style={{ color: 'white' }}>Languages:</label>
            <Select
              style={{ width: '100%' }}
              value={languages}
              onChange={(value) => setLanguages(value)}
              mode='multiple'
            >
              <Select.Option value='English'>English</Select.Option>
              <Select.Option value='Spanish'>Spanish</Select.Option>
              <Select.Option value='French'>French</Select.Option>
            </Select>
          </div>

          <div>
            <div className='field-group'>
              <label style={{ color: 'white' }}>Height:</label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  marginTop: 10,
                }}
              >
                <InputNumber
                  min={0}
                  max={10} // Set the maximum feet value as needed
                  value={feet}
                  onChange={(value) => setFeet(value)}
                />
                <span style={{ color: 'white' }}> feet </span>
                <InputNumber
                  min={0}
                  max={11} // Set the maximum inches value as needed
                  value={inches}
                  onChange={(value) => setInches(value)}
                />
                <span style={{ color: 'white' }}> inches </span>
              </div>
            </div>

            <div className='field-group'>
              <label style={{ color: 'white' }}>Weight:</label>
              <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
                <InputNumber
                  min={0}
                  max={1000} // Adjust the maximum weight as needed
                  value={weight}
                  onChange={(value) => setWeight(value)}
                />
                <span style={{ color: 'white' }}> lbs </span>
              </div>
            </div>
          </div>

          {['male', 'tranny'].includes(gender.toLowerCase()) && (
            <>
              <div className='field-group'>
                <label style={{ color: 'white' }}>Penis Size (inches):</label>
                <InputNumber
                  min={0}
                  max={24}
                  value={penisSize}
                  onChange={(value) => setPenisSize(value)}
                />
              </div>

              <div className='field-group'>
                <label style={{ color: 'white' }}>Penis Girth (inches):</label>
                <InputNumber
                  min={0}
                  max={10}
                  value={penisGirth}
                  onChange={(value) => setPenisGirth(value)}
                />
              </div>

              <div className='field-group'>
                <label style={{ color: 'white' }}>Extras:</label>
                <Checkbox.Group
                  options={[
                    { label: 'Threesome', value: 'threesome' },
                    { label: 'Orgies', value: 'orgies' },
                    { label: 'Use Toys', value: 'useToys' },
                    { label: 'Footjob', value: 'footjob' },
                    { label: 'Roleplay', value: 'roleplay' },
                    { label: 'Events', value: 'events' },
                    { label: 'Double Penetration', value: 'doublePenetration' },
                    { label: 'Oral', value: 'oral' },
                    { label: 'Bondage', value: 'bondage' },
                  ]}
                  value={[
                    threesome,
                    orgies,
                    useToys,
                    footjob,
                    roleplay,
                    events,
                    doublePenetration,
                    oral,
                    bondage,
                  ]}
                  onChange={(values) => {
                    seThreesome(values.includes('threesome'))
                    setOrgies(values.includes('orgies'))
                    setUseToys(values.includes('useToys'))
                    setFootjob(values.includes('footjob'))
                    setRoleplay(values.includes('roleplay'))
                    setEvents(values.includes('events'))
                    setDoublePenetration(values.includes('doublePenetration'))
                    setOral(values.includes('oral'))
                    setBondage(values.includes('bondage'))
                  }}
                />
              </div>
            </>
          )}
        </Modal>

        {/* make an Buttone for Filter profiles */}
        <Button
          onClick={() => setShowMap(!showMap)}
          type='primary'
          icon={<FaGlobeEurope color='#FFBF00' />}
          style={{
            position: 'fixed',
            zIndex: 999,
            bottom: 30,
            margin: 'auto',
            left: 0,
            right: 0,
            width: '140px',
            height: 40,
            borderRadius: 100,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 16,
            fontWeight: 'bold',
            color: 'white',
            gap: 15,
          }}
        >
          {!showMap ? 'Show Map' : 'Show List'}
        </Button>
        <div style={{ display: !showMap ? 'block' : 'none' }}>
        <Row gutter={[20, 20]}>
  <Col xl={7} lg={7} md={24} sm={24} xs={24}>
    {activeTab === 'Recent' ? (
      <div className='leftFeedSection'>
        {loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateRows: 'repeat(4, 1fr)',  
              gap: '5px',
            
            }}
          >
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton.Avatar
                key={index}
                active
                style={{
                  height: '400px',
                  width: '100%',
                  marginTop: '20px',
                  backgroundColor: 'var(--borderColor)',
                  borderRadius: '5px',
             
                }}
              />
            ))}
          </div>
        ) : feed?.length > 0 ? (
          feed?.map((value, index) => (
            <Card data={value} key={index} onClick={onAttachmentClick} />
          ))
        ) : (
          <NoFeeds />
        )}
      </div>
    ) : (
      <div className='leftFeedSection'>
        {loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateRows: 'repeat(4, 1fr)',  // Changed from 'gridTemplateColumns'
              gap: '5px',
            }}
          >
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton.Avatar
                key={index}
                active
                style={{
                  height: '400px',
                  width: '100%',
                  marginTop: '20px',
                  backgroundColor: 'var(--borderColor)',
                  borderRadius: '5px',
                }}
              />
            ))}
          </div>
        ) : popular?.length > 0 ? (
          popular?.map((value, index) => (
            <SingleCard data={value} key={index} onClick={onAttachmentClick} />
          ))
        ) : (
          <NoFeeds />
        )}
      </div>
    )}
  </Col>
</Row>

        </div>

        <div id='map' style={{ height: '100vh', display: showMap ? 'block' : 'none' }}></div>
      </div>
    </Layout>
  )
}

export default UserSearch
