import React, { useState } from 'react'
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
  Checkbox,
} from 'antd'
const FilterModal = ({ visible, onOk, onCancel }) => {
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
  const [height, setHeight] = useState('')
  const [languages, setLanguages] = useState([])
  const [oral, setOral] = useState(false)
  const [weight, setWeight] = useState('')
  const [orgies, setOrgies] = useState(false)
  const [penisGirth, setPenisGirth] = useState(0)
  const [penisSize, setPenisSize] = useState(0)
  const [threesome, seThreesome] = useState(0)
  const [useToys, setUseToys] = useState(false)
  const [roleplay,setRoleplay] =useState(false)
  const profiles = [
    {
      age: 45,
      assSize: 'big',
      bodyRating: 4,
      bodyType: 'chubby',
      bondage: false,
      breastCupSize: '3',
      city: 'Faisalabad',
      doublePenetration: false,
      events: false,
      footjob: false,
      gender: 'male',
      hairColor: 'BBW',
      height: '10',
      hostAvailable: true,
      hourly: [4, 18],
      languages: 'Spanish',
      oral: false,
      orgies: false,
      penisGirth: 10,
      penisSize: 24,
      roleplay: true,
      selectedEthnicities: 'Indian',
      sexualOrientation: 'bisexual',
      threesome: false,
      useToys: true,
      weight: '80',
    },
    {
      age: 45,
      assSize: 'big',
      bodyRating: 4,
      bodyType: 'chubby',
      bondage: false,
      breastCupSize: '3',
      city: 'Faisalabad',
      doublePenetration: false,
      events: false,
      footjob: false,
      gender: 'male',
      hairColor: 'BBW',
      height: '10',
      hostAvailable: true,
      hourly: [4, 18],
      languages: 'Spanish',
      oral: false,
      orgies: false,
      penisGirth: 10,
      penisSize: 24,
      roleplay: true,
      selectedEthnicities: 'Indian',
      sexualOrientation: 'bisexual',
      threesome: false,
      useToys: true,
      weight: '80',
    },
  ]

  // Assume this function is inside your React component
const handleOk = () => {
  const filteredProfiles = profiles.filter((profile) => {
    return (
      profile.city.toLowerCase().includes(city.toLowerCase()) ||
      profile.age >= ageRange[0] || profile.age <= ageRange[1] ||
      profile.gender.toLowerCase() === gender.toLowerCase() ||
      profile.hourly[0] >= hourlyRange[0] || profile.hourly[1] <= hourlyRange[1] ||
      profile.hostAvailable === hostAvailable ||
      (selectedEthnicities === '' || profile.selectedEthnicities.toLowerCase() === selectedEthnicities.toLowerCase()) ||
      (sexualOrientation === '' || profile.sexualOrientation.toLowerCase() === sexualOrientation.toLowerCase()) ||
      profile.bodyRating >= bodyRating ||
      (assSize === '' || profile.assSize.toLowerCase() === assSize.toLowerCase()) ||
      (bodyType === '' || profile.bodyType.toLowerCase() === bodyType.toLowerCase()) ||
      (bondage === false || profile.bondage === bondage) ||
      profile.breastCupSize === breastCupSize ||
      (doublePenetration === false || profile.doublePenetration === doublePenetration) ||
      (events === false || profile.events === events) ||
      (footjob === false || profile.footjob === footjob) ||
      (hairColor === '' || profile.hairColor.toLowerCase() === hairColor.toLowerCase()) ||
      profile.height === height ||
      (languages === '' || profile.languages.toLowerCase() === languages.toLowerCase()) ||
      (oral === false || profile.oral === oral) ||
      profile.weight === weight ||
      (orgies === false || profile.orgies === orgies) ||
      profile.penisGirth === penisGirth ||
      profile.penisSize === penisSize ||
      (threesome === false || profile.threesome === threesome) ||
      (useToys === false || profile.useToys === useToys) ||
      (roleplay === false || profile.roleplay === roleplay)
    );
  });
  
  onOk()
  // Use the filteredProfiles array as needed
  console.log("filteredProfiles",filteredProfiles);
  // Update your state or perform any other action with the filtered profiles
};


  return (
    <div>
      <Modal
        title='Filters'
        visible={visible}
        onOk={handleOk}
        onCancel={onCancel}
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
              style={{ width: '100%',borderRadius:10,backgroundColor:"black",color:"white",border:"2px solid" }}
              onChange={(value) => setGender(value)}
              // style={{ color: 'white' }}
              className='custom-dropdown'
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
       <div className='field-group' style={{display:"flex",gap:20}}>
          <label style={{ color: 'white' }}>Height:</label>
          <InputNumber
            min={0}
            max={100} // Adjust the maximum height as needed
            value={height}
            onChange={(value) => setHeight(value)}
          />
        </div>
        <div className='field-group' style={{display:"flex",gap:20}}>
          <label style={{ color: 'white' }}>Weight:</label>
          <InputNumber
            min={0}
            max={1000} // Adjust the maximum weight as needed
            value={weight}
            onChange={(value) => setWeight(value)}
          />
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

export default FilterModal
