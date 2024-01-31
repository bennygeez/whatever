import { Avatar, BackTop, Button, Tooltip, Modal, Radio, Select, InputNumber, Slider, Checkbox, Switch, Input } from 'antd'
import { UpOutlined } from '@ant-design/icons'

import L from 'leaflet'
import { createRoot } from 'react-dom/client';
import React, { useEffect, useRef, useState } from 'react'
import { IoChatbubblesOutline } from 'react-icons/io5'
import { FaFilter, FaGlobeEurope } from 'react-icons/fa'

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  LayerGroup,
  SVGOverlay,
  Circle,
} from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { imageBaseUrl } from '../config/constants'
import Layout from '../layout/Layout'
import { addReview, getALLusers, getReviews } from '../services/Reviews'
import Reviews from '../components/Reviews'
import { getAttachmentsByUserID, getRecentAttachments } from '../services/Attachments'


const Home = () => {
  const mapRef = useRef(null)
  const [influencers, setInfluencers] = useState([])
  const [currentLocation, setCurrentLocation] = useState(null)
  const [reviews, setReviews] = useState([])
  const [selectedInfluencer, setSelectedInfluencer] = useState(null)
  const [allUsers, setAllUsers] = useState([])
  const [newReview, setNewReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [photosMedia, setPhotosMedia] = useState([])
  const [videosMedia, setVideosMedia] = useState([])
  const [showScrollButton, setShowScrollButton] = useState(false)
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
  const [feed, setFeed] = useState([])

  const [filteredInput, setFilteredInput] = useState([])
  const profiles = feed



  useEffect(() => {

    getFeedData()
  }, [])

  const getFeedData = async () => {
    console.log('====================================');
    console.log("fil:", profiles);
    console.log('====================================');
    let response = await getRecentAttachments()
    console.log({ response })
    if (response?.status === 200) {
      setLoading(false)

      setFeed(response?.data?.data)
    } else {
      setLoading(false)
    }
  }
  const shuffleArray = (array) => {
    let currentIndex = array.length;
    let randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  };

  const handleFilterModalOk = async (e) => {
    setFilterModalVisible(false)
    const dataa = await getALLusers()
    console.log('====================================');
    console.log("datat is :", dataa);
    console.log('====================================');
    const shuffledProfiles = shuffleArray(dataa);

    // Take only the first five profiles
    const limitedProfiles = shuffledProfiles.slice(0, 5);

    // Update the influencers state with limited profiles
    setInfluencers(limitedProfiles);

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
    setFilterModalVisible(false)
  }

  const navigate = useNavigate()
  const ref = useRef()



  const handleNavigateToChat = (item) => {
    navigate(`/chat`, {
      state: {
        openChatWith: item,
      },
    })
  }
  const getReview = async (id) => {
    try {
      setLoading(true)
      const getReview = await getReviews(id)
      console.log({ getReview })
      setReviews(getReview)
      setLoading(false)
    } catch (e) {
      console.log({ e })
    }
  }
  const [filterModalVisible, setFilterModalVisible] = useState(false)
  const handleFilterModalCancel = () => {
    // Handle FilterModal cancel logic here
    setFilterModalVisible(false)
  }

  const handleAddReview = async (e, id) => {
    e.preventDefault()
    console.log({ id })
    const val = {
      givenTo: id,
      comments: newReview,
      rating: 5,
    }
    try {
      const add = await addReview(val)
      console.log({ add })

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
      console.log({ attachments })
      if (attachments) {
        const photoAttachments = attachments.data.filter(
          (attachment) => attachment.type === 'photo',
        )
        console.log('photoAttachments :', photoAttachments)
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
      console.log('🚀 ~ file: Home.jsx:138 ~ getUsers ~ data:', data)
      setAllUsers(data)
    } catch (e) {
      console.log({ e })
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
    getUsers()
  }, [])


  useEffect(() => {
    AllUsers()
  }, [allUsers, reviews])

  useEffect(() => {
    if (!mapRef.current && influencers.length) {
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

        let container = null;

        document.addEventListener('DOMContentLoaded', function (event) {
          if (!container) {
            container = document.getElementById('root1');
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
                      onClick={() => handleToggleReviews(influencer, influencer?.email, influencer?.bio)}
                    >
                      Profile
                    </Button>
                  </div>
                </div>,
              </React.StrictMode>
            );
          }
        });
        popupContent,

          marker.bindPopup(popupContent)
        marker.addTo(mapRef.current)
      })
    }
  }, [influencers, influencerIcon, currentLocation])


  return (
    <div >


      <Layout >

        <section className='map-container' >
          <div style={{ height: '12vh', paddingTop: '60px', background: 'var(--lightBGColor)',marginBottom:'10px',marginTop:'10px' }}> <Button

            type='primary'
            className='filterlinks'
            icon={<FaFilter />}
            onClick={() => setFilterModalVisible(true)}

          >
            Filters
          </Button></div>
          <div id='map' style={{ height: '100vh' }}></div>


          <Reviews
            selectedInfluencer={selectedInfluencer}
            _getReviews={getReview}
            reviews={reviews}
            clearReviews={clearReviews}
            photos={photosMedia}
            videos={videosMedia}
            loading={loading}
            ref={ref}
          />
        </section>

      </Layout>
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
              style={{ onFocus: { border: '1px solid' }, border: '1px solid' }}
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
              style={{ onFocus: { border: '1px solid' }, border: '1px solid !important' }}
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

    </div>
  )
}

export default Home
