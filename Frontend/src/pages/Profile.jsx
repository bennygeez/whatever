import {
  FloatButton,
  Modal,
  Popconfirm,
  Rate,
  Upload,
  message,
  notification,
  Avatar,
  Skeleton,
  Input,
  Button,
  Space,
  InputNumber,
  Select,
  Radio,
  Form,
  Slider,
  Switch,
  Checkbox,
} from 'antd'
import React, { createRef, useCallback, useEffect, useRef, useState } from 'react'
import { CiVideoOn } from 'react-icons/ci'
import { GoCodeReview } from 'react-icons/go'
import { IoMdPhotos } from 'react-icons/io'
import { PiAirplaneTiltFill } from 'react-icons/pi'
import Layout from '../layout/Layout'

import { UploadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import { BiLoader, BiUpload, BiVideo } from 'react-icons/bi'
import { GrClose, GrGallery } from 'react-icons/gr'
import { MdDeleteOutline, MdOutlineAccountCircle, MdPersonOutline } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { FaVideo, FaImages, FaStar, FaUser } from 'react-icons/fa'

import { useLocation } from 'react-router-dom'
import defaultProfilePicUrl from '../assets/logo.png'
import UploadModal from '../components/Upload Modal/UploadModal'
import { imageBaseUrl } from '../config/constants'
import { fetchAddress } from '../constants/getAddress'
import store from '../redux/store'
import { LOGIN } from '../redux/types/authTypes'
import { getAttachments, uploadAttachments } from '../services/Attachments'
import { deleteProfilePicture, getProfile, updateProfile, uploadProfile } from '../services/profile'
import { getReviews } from '../services/Reviews'
import LocationModal from '../components/Location Modal/LocationModal'
import moment from 'moment'

const ProfilePreviewModal = ({ visible, imageUrl, onClose }) => {
  return (
    <Modal visible={visible} onCancel={onClose} footer={null}>
      <img src={imageUrl} alt='Profile Preview' style={{ width: '100%', height: 'auto' }} />
    </Modal>
  )
}

const Profile = () => {
  const { Option } = Select
  const dispatch = useDispatch()
  const user = useSelector((state) => state.auth.user)
  const files = useSelector((state) => state.attachment.files)
  const location = useLocation()

  const tab = location.state?.tab || ''
  // console.log({ tab })
  const auth = useSelector((state) => state.auth)
  console.log({ auth })
  const [previewVisible, setPreviewVisible] = useState(false)
  const [photosMedia, setPhotosMedia] = useState([])
  const [videosMedia, setVideosMedia] = useState([])
  const [previewModalVisible, setPreviewModalVisible] = useState(false)

  const [previewImage, setPreviewImage] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [address, setAddress] = useState('')
  // console.log('address :', address)
  const [photoKey, setPhotoKey] = useState('')
  const [photoURL, setPhotoURL] = useState('')
  const [isModalVisible, setModalVisible] = useState(false)
  const [isVideoModalVisible, setVideoModalVisible] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [attachmentType, setAttachmentType] = useState('')
  const [userReviews, setReviews] = useState([])
  const [loactionModal, setLocationModal] = useState(false)
  const [userLocation, setLocation] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showButtons, setShowButtons] = useState(false)
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false)
  const [profileLoader, setProfileLoader] = useState(false)
  const fileInputRef = useRef(null)
  console.log('address', address)
  const [fileList, setFileList] = useState([
    {
      uid: '-1',
      name: 'Profile Picture',
      status: 'done',
      url: user?.photo ? `${imageBaseUrl}/${user?.photo}` : defaultProfilePicUrl,
    },
  ])
  const [formData, setFormData] = useState({
    name: 'name',
    email: 'email',
    bio: 'bio',
    city: 'city',
    age: 18,
    // distance: 10,
    gender: 'female',
    hourly: [0, 24],
    hostavailable: true,
    selectedEthnicities: 'white',
    sexualOrientation: 'straight',
    bodyRating: 0,
    feet: 0,
    inches: 0,
    weight: 0,
    assSize: 'medium', // Set a default value for assSize
    bodyType: 'average', // Set a default value for bodyType
    hairColor: '',
    breastCupSize: 'A', // Set a default value for breastCupSize
    penisSize: 0,
    penisGirth: 0,
    languages: [],
    threesome: false,
    orgies: false,
    useToys: false,
    footjob: false,
    roleplay: false,
    events: false,
    doublePenetration: false,
    oral: false,
    bondage: false,
  })
  const [currentVideo, setCurrentVideo] = useState(null)

  useEffect(() => {
    fetchAttchments()
  }, [activeTab])

  useEffect(() => {
    if (user !== null) {
      if (user?.user?.photo)
        setFileList([
          {
            uid: '-1',
            name: 'Profile Picture',
            status: 'done',
            url: `${imageBaseUrl}/${user?.user?.photo}`,
          },
        ])
      setFormData({
        name: user?.user?.name || '',
        email: user?.user?.email || '',
        bio: user?.user?.description || '',
        city: user?.user?.city || '',
        age: user?.user?.age || 18,
        distance: user?.user?.distance || 10,
        gender: user?.user?.gender || '',
        hourly: user?.user?.hourly || [0, 24],
        hostavailable: user?.user?.hostavailable || false,
        selectedEthnicities: user?.user?.selectedEthnicities || '',
        sexualOrientation: user?.user?.sexualOrientation || '',
        bodyRating: user?.user?.bodyRating || 0,
        feet: user?.user?.feet || 0,
        inches: user?.user?.inches || 0,
        weight: user?.user?.weight || 0,
        assSize: user?.user?.assSize || '', // Set a default value for assSize
        bodyType: user?.user?.bodyType || '', // Set a default value for bodyType
        hairColor: user?.user?.hairColor || '',
        breastCupSize: user?.user?.breastCupSize || '', // Set a default value for breastCupSize
        languages: user?.user?.languages || [],
        penisGirth: user?.user?.penisGirth || 0,
        penisSize: user?.user?.penisSize || 0,
        threesome: user?.user?.threesome || false,
        orgies: user?.user?.orgies || false,
        useToys: user?.user?.useToys || false,
        footjob: user?.user?.footjob || false,
        roleplay: user?.user?.roleplay || false,
        events: user?.user?.events || false,
        doublePenetration: user?.user?.doublePenetration || false,
        oral: user?.user?.oral || false,
        bondage: user?.user?.bondage || false,
      })

      let latitude = user?.user?.location?.coordinates[1]
      let longitude = user?.user?.location?.coordinates[0]

      if (latitude && longitude) {
        const fetchdata = async () => {
          const currentAddress = await fetchAddress(latitude, longitude)
          setAddress(currentAddress)
        }
        fetchdata()
      }
    }
  }, [user])

  console.log('after useEffect fetch', formData)

  useEffect(() => {
    handleTabSubmit()
  }, [tab])

  const fetchAttchments = async () => {
    setLoading(true)
    try {
      const attachments = await getAttachments()
      if (attachments) {
        const photoAttachments = attachments.data.filter(
          (attachment) => attachment.type === 'photo',
        )
        console.log('photoAttachments profile update:', photoAttachments)
        // console.log(photoAttachments)
        setPhotosMedia(photoAttachments)
        setLoading(false)
        const videoAttachments = attachments.data.filter(
          (attachment) => attachment.type === 'video',
        )
        // console.log(videoAttachments)
        setVideosMedia(videoAttachments)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching profile data:', error)
    }
  }

  const playVideo = (url) => {
    setCurrentVideo(url)
  }

  // formData funcations
  const handleInputChange = (e) => {
    console.log('e', e)
    // Check if e.target is defined
    if (e.target) {
      const { id, value } = e.target
      console.log('🚀 ~ handleInputChange ~ value:', value)
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }))
    }
  }

  const handleGenderChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      gender: value,
    }))
  }

  const handleSliderChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      hourly: value,
    }))
  }

  const handleInputNumberChange = (index, value) => {
    setFormData((prevData) => {
      const newHourly = [...prevData.hourly]
      console.log('🚀 ~ setFormData ~ newHourly:', newHourly)
      newHourly[index] = value
      return {
        ...prevData,
        hourly: newHourly,
      }
    })
  }

  const handleSwitchChange = (checked) => {
    setFormData((prevData) => ({
      ...prevData,
      hostavailable: checked,
    }))
  }

  const handleEthnicityChange = (values) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedEthnicities: values,
    }))
  }

  const handleSexualOrientationChange = (values) => {
    setFormData((prevData) => ({
      ...prevData,
      sexualOrientation: values,
    }))
  }

  const handleBodyRatingChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      bodyRating: value,
    }))
  }

  const handleAssSizeChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      assSize: value,
    }))
  }

  const handleBodyTypeChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      bodyType: value,
    }))
  }
  const handleHairColorChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      hairColor: value,
    }))
  }

  const handleBreastCupSizeChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      breastCupSize: value,
    }))
  }

  const handleLanguagesChange = (values) => {
    setFormData((prevData) => ({
      ...prevData,
      languages: values,
    }))
  }
  const handleHeightChange = (value, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }))
  }

  const handleWeightChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      weight: value,
    }))
  }

  const handlePenisSizeChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      penisSize: value,
    }))
  }

  const handlePenisGirthChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      penisGirth: value,
    }))
  }

  const handleCheckboxGroupChange = (checkedValues) => {
    setFormData((prevData) => ({
      ...prevData,
      threesome: checkedValues.includes('threesome'),
      orgies: checkedValues.includes('orgies'),
      useToys: checkedValues.includes('useToys'),
      footjob: checkedValues.includes('footjob'),
      roleplay: checkedValues.includes('roleplay'),
      events: checkedValues.includes('events'),
      doublePenetration: checkedValues.includes('doublePenetration'),
      oral: checkedValues.includes('oral'),
      bondage: checkedValues.includes('bondage'),
    }))
  }
  const [isEditing, setEditing] = useState(false);


  const handleEditLocation = () => {
    setEditing(true);
  };

  const handleSaveLocation = () => {
    setEditing(false);
    // Save the updated address in your state or perform any necessary actions
  };

  const handleCancelEdit = () => {
    setEditing(false);
    // Reset the address to the previous value or perform any necessary actions
  };
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (user !== null) {
      if (formData) {
        setProfileLoading(true)
        try {
          const updatedData = await updateProfile({
            id: user?.user?._id,
            name: formData.name,
            email: formData.email.toLowerCase(),
            city: formData.city,
            age: formData.age,
            gender: formData.gender,
            hourly: formData.hourly,
            hostavailable: formData.hostavailable,
            selectedEthnicities: formData.selectedEthnicities,
            sexualOrientation: formData.sexualOrientation,
            bodyRating: formData.bodyRating,
            assSize: formData.assSize,
            bodyType: formData.bodyType,
            breastCupSize: formData.breastCupSize,
            languages: formData.languages,
            hairColor: formData.hairColor,
            feet: formData.feet,
            inches: formData.inches,
            weight: formData.weight,
            penisSize: formData.penisSize,
            penisGirth: formData.penisGirth,
            // Additional properties
            threesome: formData.threesome,
            orgies: formData.orgies,
            useToys: formData.useToys,
            footjob: formData.footjob,
            roleplay: formData.roleplay,
            events: formData.events,
            doublePenetration: formData.doublePenetration,
            oral: formData.oral,
            bondage: formData.bondage,
            description: formData.bio,
            photo: user?.user?.photo,
          })

          dispatch({
            type: LOGIN,
            payload: { ...auth, user: { ...auth?.user, user: updatedData } },
          })
          setProfileLoading(false)
          notification.success({
            message: 'Profile updated successfully',
            duration: 3,
            style: { marginTop: '50px' },
          })
        } catch (error) {
          setProfileLoading(false)
          console.error('Update Profile Error:', error)

          notification.error({
            message: `${error}`,
            duration: 3,
            style: { marginTop: '50px' },
          })
        }
      }
    }
  }
  const reviews = [
    { id: 1, rating: 4, comment: 'Great user! Very satisfied with their service.' },
    { id: 2, rating: 5, comment: 'Excellent experience! Would recommend.' },
  ]
  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0

  const handlePreview = async (file) => {
    // uploadProfileImg()
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    setPreviewImage(file.url || file.preview)

    setPreviewVisible(true)
  }
  const handlePreviewPhoto = () => {
    // if (user?.user?.photo && user?.user?.photo !== null) {
    setPreviewModalVisible(true)
    // }
  }
  const handlePreviewModalClose = () => {
    setPreviewModalVisible(false)
  }
  // const handleChange = ({ fileList }) => {
  //   setFileList(fileList)
  //   uploadProfileImg(fileList)
  // }
  const handleFileChange = async (event) => {
    console.log(event.target.files[0])
    setSelectedImage(event.target.files[0])
    await uploadProfileImg(event.target.files[0])
    setIsUpdatingPhoto(false)
  }
  const handleUpdateClick = () => {
    setIsUpdatingPhoto(true)

    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }
  const handleDeleteProfilePhoto = async () => {
    const data = await deleteProfilePicture()
    console.log({ data })
    setIsUpdatingPhoto(false)

    setSelectedImage(null)
  }
  const uploadProfileImg = async (files) => {
    // let file
    // files.map((val) => {
    //   file = val.originFileObj
    // })
    setProfileLoader(true)
    console.log({ files })
    if (files) {
      const data = await uploadProfile(files)
      console.log({ data })
      const keyPhoto = data?.photo
      // await fetchProfile()
      setPhotoKey(keyPhoto)
      setPhotoURL(`${imageBaseUrl}/${photoKey}`)
      try {
        const updatedData = await updateProfile({
          id: user?.user?._id,
          photo: keyPhoto,
        })

        dispatch({
          type: LOGIN,
          payload: { ...auth, user: { ...auth?.user, updatedData } },
        })
        setProfileLoader(false)
        notification.success({
          message: 'profile updated successfully',
          duration: 3,
          style: { marginTop: '50px' },
        })
      } catch (error) {
        notification.error({
          message: error,
          duration: 3,
          style: { marginTop: '50px' },
        })
        setProfileLoader(false)
      }
    }
  }

  const handleCancelPreview = () => {
    setPreviewVisible(false)
  }
  const handleOk = () => {
    setPreviewVisible(false)
  }

  // Upload Modal Functions
  const handleUploadImages = () => {
    setAttachmentType('photo')
    setModalVisible(true)
  }
  const handleModalCancel = () => {
    setModalVisible(false)
    setVideoModalVisible(false)
    store.dispatch({
      type: 'SET_FILE',
      payload: null,
    })
  }

  const handleModalOk = async (files, type) => {
    console.log({ files })

    const onSubmit = async () => {
      try {
        let combinedFiles = []

        if (files.uploadedFiles && files.uploadedFiles.length > 0) {
          combinedFiles = [...combinedFiles, ...files.uploadedFiles]
        }
        if (files.capturedFile) {
          combinedFiles.push(files.capturedFile)
        }
        if (combinedFiles.length > 0) {
          const data = await uploadAttachments(combinedFiles, type, setUploadLoading)
          console.log('data :', data)
        } else {
          console.log('No files to upload.')
        }
      } catch (error) {
        console.error('Error updating profile:', error)
      }
    }

    await onSubmit()
    setModalVisible(false)
    setVideoModalVisible(false)
    fetchAttchments()
  }
  const handleUploadVideos = () => {
    setAttachmentType('video')
    setVideoModalVisible(true)
  }
  const handleTabSubmit = async () => {
    if (tab !== '') {
      setActiveTab(tab)

      if (tab === 'pictures') {
        setModalVisible(false)
        handleUploadImages()
      }
      if (tab === 'videos') {
        setVideoModalVisible(false)
        handleUploadVideos()
      }
    } else {
      setActiveTab('profile')
    }
  }

  const handleOpenVideoModal = (video) => {
    setSelectedVideo(video)
    setShowVideoModal(true)
  }

  const handleCloseVideoModal = () => {
    setShowVideoModal(false)
  }

  const handleOpenPhotoModal = (photo) => {
    setSelectedPhoto(photo)
    setShowPhotoModal(true)
  }

  const handleClosePhotoModal = () => {
    setShowPhotoModal(false)
  }

  const handleDeletePhoto = () => {
    setShowPhotoModal(false)
  }

  // components
  const NoImagesFound = ({ type = 'photo' }) => {
    return (
      <div className='noPhotoContainer'>
        {type === 'photo' ? (
          <p className='uploadPhoto'>Upload Photos to see here.</p>
        ) : (
          <p className='uploadPhoto'>Upload Videos to see here.</p>
        )}
      </div>
    )
  }
  useEffect(() => {
    if (activeTab === 'reviews' && user) {
      getReview()
    }
  }, [activeTab])

  const getReview = async (id) => {
    try {
      // setLoading(true)
      const getReview = await getReviews()
      console.log({ getReview })
      setReviews(getReview)
      // setLoading(false)
    } catch (e) {
      console.log({ e })
    }
  }

  const handleSetLocation = () => {
    setLocationModal(true)
  }

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation)
  }

  const handlelocationModalOK = async () => {
    setLocationModal(false)
    console.log({ userLocation })
    const [latitude, longitude] = userLocation.map(String)
    console.log({ latitude, longitude })
    try {
      const updatedData = await updateProfile({
        id: user?.user?._id,
        latitude: latitude,
        longitude: longitude,
      })

      dispatch({
        type: LOGIN,
        payload: { ...auth, user: { ...auth?.user, updatedData } },
      })
      notification.success({
        message: 'Location updated successfully',
        duration: 3,
        style: { marginTop: '50px' },
      })
      // await fetchProfile()
      const currentAddress = await fetchAddress(latitude, longitude)

      setAddress(currentAddress)
    } catch (error) {
      notification.error({
        message: error,
        duration: 3,
        style: { marginTop: '50px' },
      })
    }
  }

  const handleCloseModal = () => {
    setLocationModal(false)
  }
  console.log({ user })

  return (
    <Layout active={'profile'}>
      <div className='profile-container'>
        <span className='span'>
          <MdPersonOutline size={20} style={{ marginRight: '5px' }} />
          <h3>My Profile </h3>
        </span>
        <div className='profile-header'>
          <div className='leftsection'>
            <div className='custom-tabs'>
              <div className='tabRow' onClick={() => handleTabClick('profile')}>
                <FaUser
                  size={20}
                  className={activeTab === 'profile' ? 'iconColo-active' : 'iconColor'}
                  color={activeTab === 'profile' ? 'rgb(94, 94, 247)' : '#9FE2BF'}
                />
                <button className={activeTab === 'profile' ? 'active' : ''}>Profile</button>
              </div>
              <div className='tabRow' onClick={() => handleTabClick('pictures')}>
                <FaImages
                  size={20}
                  className={activeTab === 'pictures' ? 'iconColo-active' : 'iconColor'}
                  color={activeTab === 'pictures' ? 'rgb(94, 94, 247)' : 'purple'}
                />
                <button className={activeTab === 'pictures' ? 'active' : ''}>Pictures</button>
              </div>
              <div className='tabRow' onClick={() => handleTabClick('videos')}>
                <FaVideo
                  className={activeTab === 'videos' ? 'iconColo-active' : 'iconColor'}
                  size={20}
                  // style={{ marginLeft: '10px' }}
                  color={activeTab === 'videos' ? 'rgb(94, 94, 247)' : '#808000'}
                />
                <button className={activeTab === 'videos' ? 'active' : ''}>Videos</button>
              </div>
              <div className='tabRow' onClick={() => handleTabClick('reviews')}>
                <FaStar
                  size={20}
                  className={activeTab === 'reviews' ? 'iconColo-active' : 'iconColor'}
                  // style={{ marginLeft: '10px' }}
                  color={activeTab === 'reviews' ? 'rgb(94, 94, 247)' : '#50C878'}
                />
                <button className={activeTab === 'reviews' ? 'active' : ''}>Reviews</button>
              </div>
            </div>
          </div>

          <div className='rightsection'>
            {activeTab === 'profile' && (
              <>
                <span></span>

                <div className='profileBorder'>
                  <div className='avatar-section'>
                    <div className='address'>
                      {profileLoader ? (
                        <div className='loader-container'>
                          <div className='loader'></div>
                        </div>
                      ) : (
                        <div
                          style={{
                            position: 'relative',
                            display: 'inline-block',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={() => setShowButtons(true)}
                          onMouseLeave={() => setShowButtons(false)}
                        >
                          <img
                            src={
                              user?.user?.photo && user?.user?.photo !== null
                                ? `${imageBaseUrl}/${user?.user?.photo}`
                                : defaultProfilePicUrl
                            }
                            alt='Profile'
                            style={{
                              width: '100px',
                              height: '100px',
                              borderRadius: '50%',
                              cursor: 'pointer',
                              outline: '1px solid gray',
                              objectFit: 'contain',
                              marginTop: '30px',
                            }}
                          />

                          {showButtons && (
                            <div
                              style={{
                                position: 'absolute',
                                bottom: 0,
                                left: '25%',
                                transform: 'translateX(-30%)',
                                display: 'grid',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '20%',
                                marginTop: '5px',
                              }}
                            >
                              <button
                                onClick={handlePreviewPhoto}
                                style={{
                                  backgroundColor: 'purple',
                                  color: 'white',
                                  marginBottom:
                                    user?.user?.photo && user?.user?.photo !== null
                                      ? '10px'
                                      : '20px',
                                  border: 'none',
                                  borderRadius: '10px',
                                  cursor: 'pointer',
                                }}
                              >
                                View
                              </button>
                              <button
                                onClick={handleUpdateClick}
                                style={{
                                  backgroundColor: 'purple',
                                  color: 'white',
                                  marginBottom:
                                    user?.user?.photo && user?.user?.photo !== null
                                      ? '10px'
                                      : '20px',
                                  border: 'none',
                                  borderRadius: '10px',
                                  cursor: 'pointer',
                                  position: 'relative',
                                }}
                              >
                                <Input
                                  type='file'
                                  name='myImage'
                                  accept='image/*'
                                  style={{
                                    opacity: 0,
                                    position: 'absolute',
                                    width: '50px',
                                    height: '15px',
                                  }}
                                  onChange={handleFileChange}
                                />
                                Update
                              </button>
                              {user?.user?.photo && user?.user?.photo !== null && (
                                <button
                                  onClick={handleDeleteProfilePhoto}
                                  style={{
                                    backgroundColor: 'purple',
                                    color: 'white',
                                    marginBottom: '15px',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <br />

                      {user?.user?.photo && user?.user?.photo === null ? (
                        <label
                          className='custom-file-input'
                          ref={fileInputRef}
                          style={{ display: isUpdatingPhoto ? 'none' : 'flex' }}
                        >
                          <UploadOutlined size={50} />
                          <Input
                            type='file'
                            name='myImage'
                            accept='image/*'
                            style={{ visibility: 'hidden' }}
                            onChange={handleFileChange}
                          />
                        </label>
                      ) : null}
                    </div>
                    {/* <Upload
                        beforeUpload={() => false}
                        listType='picture-circle'
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                      >
                        {fileList.length >= 1 ? null : <UploadOutlined />}
                      </Upload>
                    
                      {fileList.length >= 1 ? (
                        <div className='icon-container'>
                          <EyeOutlined size={30} style={{ color: 'white', paddingRight: '10px' }} />
                          <DeleteOutlined
                            size={30}
                            style={{ color: 'white', paddingRight: '15px' }}
                          />
                        </div>
                      ) : null} */}

                    <div className='form'>
                      <form onSubmit={handleSubmit}>
                        <div className='field-group'>
                          <input
                            type='text'
                            id='name'
                            autoComplete='off'
                            value={formData.name}
                            onChange={handleInputChange}
                            className='input-field'
                          />
                          <label htmlFor='name' className='input-label'>
                            Name :
                          </label>
                        </div>
                        <div className='field-group'>
                          <input
                            type='text'
                            id='email'
                            autoComplete='off'
                            value={formData.email}
                            onChange={handleInputChange}
                            className='input-field'
                          />
                          <label htmlFor='name' className='input-label'>
                            Email :
                          </label>
                        </div>

                        <div className='field-group'>
                          <label htmlFor='location' className='location-label'>
                            Location:
                          </label>
                          <div className='location-field'>
                            {isEditing ? (
                              <>
                                <input
                                  type='text'
                                  id='location'
                                  className='input-field'
                                  style={{ height: '30px' }} // Set a fixed height for the input field
                                  value={address}
                                  onChange={(e) => setAddress(e.target.value)}
                                />
                                <button className='editBTN' type='button' onClick={handleSaveLocation}>
                                  Save
                                </button>
                                <button className='editBTN' type='button' onClick={handleCancelEdit}>
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <div className='location-label-field' style={{ height: '30px' }}>
                                  <p className='profileLocation' style={{ color: 'var(--textColor)' }}>{address}</p>
                                </div>
                                <button className='editBTN' type='button' onClick={handleEditLocation}>
                                  <PiAirplaneTiltFill className='locationIcon' /> Edit Location
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                        {/* <div className='field-group'>
                          <input
                            type='text'
                            id='city'
                            autoComplete='off'
                            value={formData.city}
                            onChange={handleInputChange}
                            className='input-field'
                          />
                          <label htmlFor='name' className='input-label'>
                            City :
                          </label>
                        </div> */}
                        <div className='field-group'>
                          <input
                            type='number'
                            id='age'
                            autoComplete='off'
                            value={formData.age}
                            onChange={handleInputChange}
                            className='input-field'
                            min={18}
                            max={99}
                          />
                          <label htmlFor='name' className='input-label'>
                            Age :
                          </label>
                        </div>
                        {/* <div className='field-group'>
                          <input
                            type='number'
                            id='distance'
                            autoComplete='off'
                            value={formData.distance}
                            onChange={handleInputChange}
                            className='input-field'
                            maxLength={2}
                            min={0}
                            max={99}
                          />
                          <label htmlFor='name' className='input-label'>
                            Distance (in miles):
                          </label>
                        </div> */}
                        <div className='field-group' style={{ color: 'var(--textColor)' }}>
                          {/* <label style={{ color: 'var(--textColor)' }} htmlFor=''>
                            Gender:
                          </label> */}
                          <label htmlFor='name' className='input-label'>
                            Gender :
                          </label>
                          <Select
                            placeholder='Select gender'
                            style={{ width: '100%', color: 'white' }}
                            value={formData.gender}
                            onChange={handleGenderChange}
                          >
                            <Select.Option value='male'>Male</Select.Option>
                            <Select.Option value='gay'>Gay</Select.Option>
                            <Select.Option value='tranny'>tranny</Select.Option>
                            <Select.Option value='female'>Female</Select.Option>
                          </Select>
                        </div>

                        <div className='field-group'>
                          <label style={{ color: 'var(--textColor)' }}>Hourly:</label>
                            <Slider
                              range
                              min={0}
                              max={5000}
                              defaultValue={[0]} // Set the default range from 0 to 5000
                              onChange={(value) => {
                                // Ensure the range stays within 0 to 5000
                                const [minValue, maxValue] = value;
                                if (minValue < 0) {
                                  value[0] = 0;
                                }
                                if (maxValue > 5000) {
                                  value[1] = 5000;
                                }
                                handleSliderChange(value); // Call your custom handler with the adjusted value
                              }}
                            />
                            <div style={{ display: "flex", gap: 20 }}>
                              <InputNumber
                                min={0}
                                max={5000}
                                value={formData.hourly[0]}
                                onChange={(value) => handleInputNumberChange(0, value)}
                              />
                          </div>
                        </div>
                        
                        <div
                          className='field-group'
                          style={{ display: 'flex', gap: 10, alignItems: 'center' }}
                        >
                          <label style={{ color: 'var(--textColor)' }}>Scene location (Host available):</label>
                          <Select
                            defaultValue={formData.hostavailable ? 'Yes' : 'No'}
                            style={{ width: '100px',marginBottom:'30px' }}

                          >
                            <Option value='Yes'>Yes</Option>
                            <Option value='No'>No</Option>
                          </Select>
                        </div>
                        <div className='field-group'>
                          {/* <label style={{ color: 'var(--textColor)' }}>Ethnicity:</label> */}
                          <label htmlFor='name' className='input-label'>
                            Ethnicity:
                          </label>
                          <Select
                            placeholder='Select ethnicities'
                            style={{ width: '100%' }}
                            value={formData.selectedEthnicities}
                            onChange={handleEthnicityChange}
                          >
                            <Select.Option value='White'>White</Select.Option>
                            <Select.Option value='Ebony'>Ebony</Select.Option>
                            <Select.Option value='Hispanic'>Hispanic</Select.Option>
                            <Select.Option value='Asian'>Asian</Select.Option>
                            <Select.Option value='Middle Eastern'>Middle Eastern</Select.Option>
                            <Select.Option value='European'>European</Select.Option>
                            <Select.Option value='German'>German</Select.Option>
                            <Select.Option value='Indian'>Indian</Select.Option>
                          </Select>
                        </div>
                        <div className='field-group'>
                          <label className='input-label'>Sexual Orientation:</label>

                          <Select
                            placeholder='Select sexual orientation'
                            style={{ width: '100%', color: 'white' }}
                            value={formData.sexualOrientation}
                            onChange={handleSexualOrientationChange}
                          >
                            <Select.Option value='straight'>Straight</Select.Option>
                            <Select.Option value='gay'>Gay</Select.Option>
                            <Select.Option value='trans'>Trans</Select.Option>
                            <Select.Option value='bisexual'>Bisexual</Select.Option>
                          </Select>
                        </div>
                        <div className='field-group'>
                          <label style={{ color: 'var(--textColor)' }}>Body Rating (0-10):</label>
                          <Slider
                            min={0}
                            max={10}
                            defaultValue={formData.bodyRating}
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
                            onChange={handleBodyRatingChange}
                            value={formData.bodyRating}
                          />
                        </div>

                        <div className='field-group'>
                          <label className='input-label'>Ass Size:</label>
                          <Select
                            placeholder='Select ass size'
                            style={{ width: '100%' }}
                            value={formData.assSize}
                            onChange={handleAssSizeChange}
                          >
                            <Select.Option value='small'>Small</Select.Option>
                            <Select.Option value='medium'>Medium</Select.Option>
                            <Select.Option value='big'>Big</Select.Option>
                          </Select>
                        </div>

                        <div className='field-group'>
                          <label className='input-label'>Body Type:</label>
                          <Select
                            placeholder='Select body type'
                            style={{ width: '100%' }}
                            value={formData.bodyType}
                            onChange={handleBodyTypeChange}
                          >
                            <Select.Option value='slim'>Slim</Select.Option>
                            <Select.Option value='average'>Average</Select.Option>
                            <Select.Option value='athletic'>Athletic</Select.Option>
                            <Select.Option value='chubby'>Chubby</Select.Option>
                            <Select.Option value='BBW'>BBW</Select.Option>
                          </Select>
                        </div>
                        <div className='field-group'>
                          <label className='input-label'>Hair Color:</label>
                          <Select
                            placeholder='Select body type'
                            style={{ width: '100%' }}
                            value={formData.hairColor}
                            onChange={handleHairColorChange}
                          >
                            <Select.Option value='slim'>black</Select.Option>
                            <Select.Option value='average'>brown</Select.Option>
                            <Select.Option value='athletic'>blond</Select.Option>
                            <Select.Option value='chubby'>white</Select.Option>
                            <Select.Option value='BBW'>gray</Select.Option>
                          </Select>
                        </div>

                        <div className='field-group'>
                          <label style={{ color: 'var(--textColor)' }}>Breast Cup Size:</label>
                          <Slider
                            min={0}
                            max={5}
                            defaultValue={0}
                            marks={{ 0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'DD', 5: 'DD+' }}
                            markerHeight={5}
                            style={{ color: 'white' }}
                            value={formData.breastCupSize}
                            onChange={(value) => handleBreastCupSizeChange(value)}
                            tooltipVisible={false}
                          />
                        </div>

                        <div className='field-group'>
                          <label className='input-label'>Languages:</label>
                          <Select
                            style={{ width: '100%' }}
                            value={formData.languages}
                            onChange={handleLanguagesChange}
                            mode='multiple'
                          >
                            <Select.Option value='English'>English</Select.Option>
                            <Select.Option value='Spanish'>Spanish</Select.Option>
                            <Select.Option value='French'>French</Select.Option>
                          </Select>
                        </div>
                        <div>
                          <div className='field-group'>
                            <label style={{ color: 'var(--textColor)' }}>Height:</label>
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
                                value={formData.feet}
                                onChange={(value) => handleHeightChange(value, 'feet')}
                              />
                              <span style={{ color: 'white' }}> feet </span>
                              <InputNumber
                                min={0}
                                max={11} // Set the maximum inches value as needed
                                value={formData.inches}
                                onChange={(value) => handleHeightChange(value, 'inches')}
                              />
                              <span style={{ color: 'white' }}> inches </span>
                            </div>
                          </div>

                          <div className='field-group'>
                            <label style={{ color: 'var(--textColor)' }}>Weight:</label>
                            <div
                              style={{
                                display: 'flex',
                                gap: 10,
                                marginTop: 10,
                                alignItems: 'center',
                              }}
                            >
                              <InputNumber
                                min={0}
                                max={1000} // Adjust the maximum weight as needed
                                value={formData.weight}
                                onChange={handleWeightChange}
                              />
                              <span style={{ color: 'white' }}> lbs </span>
                            </div>
                          </div>
                        </div>

                        {/* Display the following fields only if 'male' or 'tranny' is selected */}
                        {['male', 'tranny'].includes(formData.gender.toLowerCase()) && (
                          <div>
                            <div
                              className='field-group'
                              style={{ display: 'flex', gap: 20, alignItems: 'center' }}
                            >
                              <label style={{ color: 'var(--textColor)' }}>Penis Size (inches):</label>
                              <InputNumber
                                min={0}
                                max={24} // Adjust the maximum size as needed
                                value={formData.penisSize}
                                onChange={handlePenisSizeChange}
                              />
                            </div>

                            <div
                              className='field-group'
                              style={{ display: 'flex', gap: 20, alignItems: 'center' }}
                            >
                              <label style={{ color: 'var(--textColor)' }}>Penis Girth (inches):</label>
                              <InputNumber
                                min={0}
                                max={10} // Adjust the maximum girth as needed
                                value={formData.penisGirth}
                                onChange={handlePenisGirthChange}
                              />
                            </div>
                          </div>
                        )}
                        <div
                          className='field-group'
                          style={{ display: 'flex', flexDirection: 'column' }}
                        >
                          <label style={{ color: 'var(--textColor)' }}>Extras:</label>
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
                            value={Object.keys(formData).filter((key) => formData[key])}
                            onChange={handleCheckboxGroupChange}
                          />
                        </div>

                        <div className='field-group'>
                          <textarea
                            id='bio'
                            autoComplete='off'
                            value={formData.bio}
                            onChange={handleInputChange}
                            className='input-field bio-input-field'
                          />
                          <label htmlFor='name' className='input-label'>
                            Bio :
                          </label>
                        </div>
                        <div className='buttons'>
                          <button type='submit' className='saveBTN'>
                            {profileLoading ? (
                              <>
                                <BiLoader /> Save
                              </>
                            ) : (
                              'Save'
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </>
            )}
            {activeTab === 'pictures' && (
              <>
                <FloatButton.Group
                  trigger='click'
                  type='primary'
                  className='FLOATING_BTN'
                  closeIcon={<GrClose />}
                  style={{
                    right: 100,
                    marginBottom: '3rem',
                  }}
                  icon={<BiUpload color='white' size={20} />}
                >
                  <FloatButton
                    type='primary'
                    icon={<GrGallery size={20} />}
                    style={{ right: 24 }}
                    onClick={handleUploadImages}
                  />
                </FloatButton.Group>

                <div className='pictureHeaderRow'>
                  {/* 
                  <button onClick={handleUploadImages} className='uploadBtn'>
                    Add Photos <IoMdAdd size={20} />
                  </button> */}
                </div>

                <div>
                  {photosMedia?.length === 0 ? (
                    <NoImagesFound type='photo' />
                  ) : (
                    <>
                      {loading ? (
                        <div className='images-container'>
                          {photosMedia?.map((v, i) => (
                            <div
                              key={i}
                              style={{
                                height: '300px',
                                width: '100%',
                                borderRadius: '5px',
                                background: 'var(--cardColor)',
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className='images-container'>
                          {photosMedia.map((item, index) => (
                            <div
                              key={index}
                              style={{ position: 'relative', marginTop: '13px' }}
                              onClick={() => handleOpenPhotoModal(item)}
                            >
                              <img
                                style={{ width: '100%', height: '300px', objectFit: 'fill' }}
                                src={`${imageBaseUrl}/${item.path}`}
                                alt={`img-${index}`}
                              />
                              {photosMedia?.length !== 0 && (
                                <div style={{ display: 'flex', paddingTop: '5px' }}>
                                  <p style={{ fontWeight: 'bold', color: 'white' }}>
                                    {moment(item?.createdAt).isSame(moment(), 'day')
                                      ? moment(item?.createdAt).fromNow()
                                      : moment(item?.createdAt).format('DD MMM, YYYY')}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  <Modal
                    title=''
                    open={showPhotoModal}
                    onCancel={handleClosePhotoModal}
                    footer={null}
                    centered
                  >
                    {selectedPhoto && (
                      <div>
                        <img
                          style={{
                            width: '100%',
                            maxHeight: '70vh',
                            objectFit: 'contain',
                            '@media screen and(max-width: 600px)': {
                              width: '80%',
                            },
                          }}
                          src={`${imageBaseUrl}/${selectedPhoto.path}`}
                          alt={`selected-img`}
                        />
                        {/* <Popconfirm
                          title='Delete the Photo'
                          description='Are you sure to delete this Photo?'
                          onConfirm={handleDeletePhoto}
                          onCancel={handleDeletePhoto}
                          okText='Yes'
                          cancelText='No'
                        >
                          <MdDeleteOutline
                            style={{
                              color: 'red',
                              fontSize: '20px',
                              position: 'absolute',
                              bottom: '1rem',
                              right: '1rem',
                              cursor: 'pointer',
                              '& @media (max-width: 500px)': {
                                bottom: '2rem',
                                right: '2rem',
                              },
                            }}
                          />
                        </Popconfirm> */}
                      </div>
                    )}
                  </Modal>
                </div>
              </>
            )}
            {activeTab === 'videos' && (
              <>
                <FloatButton.Group
                  trigger='click'
                  type='primary'
                  className='FLOATING_BTN'
                  closeIcon={<GrClose />}
                  style={{
                    right: 100,
                    marginBottom: '3rem',
                  }}
                  icon={<BiUpload color='white' size={20} />}
                >
                  <FloatButton
                    type='primary'
                    icon={<BiVideo size={20} />}
                    style={{ right: 24 }}
                    onClick={handleUploadVideos}
                  />
                </FloatButton.Group>
                <div className='pictureHeaderRow'></div>

                <div>
                  {videosMedia?.length === 0 ? (
                    <NoImagesFound type='video' />
                  ) : (
                    <>
                      {loading ? (
                        <div className='videos-container'>
                          {videosMedia?.map((v, i) => (
                            <div
                              key={i}
                              style={{
                                height: '300px',
                                width: '80%',
                                borderRadius: '5px',
                                background: 'var(--cardColor)',
                              }}
                            />
                          ))}
                        </div>
                      ) : (
                        <>
                          <div className='videos-container'>
                            {videosMedia.map((item, index) => (
                              <div
                                key={index}
                                className='video-item'
                                onClick={() => handleOpenVideoModal(item)}
                              >
                                <video controls width='100%' height='300px' className='videoCSS'>
                                  <source src={`${imageBaseUrl}/${item.path}`} />
                                  Your browser does not support the video tag.
                                </video>

                                <div style={{ display: 'flex', paddingTop: '5px' }}>
                                  <p style={{ fontWeight: 'bold', color: 'white' }}>
                                    {moment(item?.createdAt).isSame(moment(), 'day')
                                      ? moment(item?.createdAt).fromNow()
                                      : moment(item?.createdAt).format('DD MMM, YYYY')}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {/* {videosData.map((item, index) => (
                    <div key={index} className='video-item'>
                      {currentVideo === item.url ? (
                        <video controls width='300' height='200' autoPlay>
                          <source src={item.url} type='video/mp4' />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div>
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            style={{ width: '300px', height: '200px', position: 'relative' }}
                          />
                          <FaCirclePlay
                            size={35}
                            color='white'
                            onClick={() => playVideo(item.url)}
                            style={{ position: 'absolute', top: '20%', left: '45%' }}
                          />
                        </div>
                      )}
                      <div className='video-info'>
                        <h4 className='video-title'>{item.title}</h4>
                        <p className='video-description'>{item.description}</p>
                      </div>
                    </div>
                  ))} */}
                          </div>
                        </>
                      )}
                    </>
                  )}

                  <Modal
                    title='Video'
                    open={showVideoModal}
                    onCancel={handleCloseVideoModal}
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
              </>
            )}
            {activeTab === 'reviews' && (
              <>
                {userReviews?.length === 0 && (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: ' 100%',
                        height: ' 100px',
                        marginTop: '20%',
                      }}
                    >
                      <img src={require('../assets/n-reviews-found.png')} width={100} />

                      <p className='noReview'>No Reviews Found</p>
                    </div>
                  </>
                )}

                <div className='reviewsTab'>
                  {userReviews.map((review) => (
                    <>
                      <div className='review-container'>
                        <img
                          src={
                            review?.givenBy?.photo
                              ? `${imageBaseUrl}/${review?.givenBy?.photo}`
                              : defaultProfilePicUrl
                          }
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            outline: '1px solid gray',
                            objectFit: 'contain',
                          }}
                        />

                        <div className='reviewCOl'>
                          <h3 className='reviewer'>{review?.givenBy?.name}</h3>
                          <p className='email'>{review?.givenBy?.email}</p>

                          <div key={review._id} style={{ margin: '15px' }}>
                            {/* <Rate disabled allowHalf defaultValue={review?.rating} /> */}

                            <p className='reviewComment'>{review?.comments}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <ProfilePreviewModal
        visible={previewModalVisible}
        imageUrl={user?.user?.photo ? `${imageBaseUrl}/${user?.user?.photo}` : defaultProfilePicUrl}
        onClose={handlePreviewModalClose}
      />

      <Modal open={previewVisible} onOk={handleOk} onCancel={handleCancelPreview} footer={null}>
        <img alt='Preview' style={{ width: '100%' }} src={previewImage} />
      </Modal>
      {attachmentType === 'photo' && (
        <UploadModal
          title='Add Photos'
          visible={isModalVisible}
          onCancel={handleModalCancel}
          onOk={handleModalOk}
          // onOk={() => {
          //   handleModalOk();
          //   handleModalCancel(); // Close the photo modal
          // }}
          okText='Submit'
          cancelText='Cancel'
          type={attachmentType}
          tab={activeTab}
          loadingState={uploadLoading}
        />
      )}
      {attachmentType === 'video' && (
        <UploadModal
          title='Add Video'
          visible={isVideoModalVisible}
          onCancel={handleModalCancel}
          onOk={handleModalOk}
          okText='Submit'
          cancelText='Cancel'
          type={attachmentType}
          tab={activeTab}
          loadingState={uploadLoading}
        ></UploadModal>
      )}
    </Layout>
  )
}

export default Profile
