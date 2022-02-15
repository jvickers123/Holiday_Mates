import React, { useState, useEffect } from 'react'
import ReactMapGl, { Marker, Popup } from 'react-map-gl'
import { REACT_APP_MAPBOX_ACCESS_TOKEN } from '../enviroment/env'
import axios from 'axios'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Avatar, useDisclosure, Input, Button, FormControl, Select, FormLabel, Box, VStack, Menu,  Modal, ModalFooter, ModalBody, ModalHeader, ModalOverlay, ModalContent, ModalCloseButton, Heading, Checkbox } from '@chakra-ui/react'
// import { getTokenFromLocal } from '../enviroment/helpers/auth'

const Search = () => {

  const [viewPort, setViewPort] = useState({
    latitude: 51,
    longitude: -0.1,
    zoom: 1
  })
  const [searchValues, setSearchValues] = useState({
    search: '',
    holidayType: '',
    showMatesHolidays: true,
    showMyHolidays: true,
  })
  const [currentLocation, setCurrentLocation] = useState(null)
  const [resultsOptions, setResultsOptions] = useState([])
  const [data, setData] = useState([])
  const [showPopup, setShowPopup] = useState(null)

    const handleChange = (e) => setSearchValues({...searchValues, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
        const { data } = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchValues.search}.json?access_token=pk.eyJ1IjoianZpY2tlcnMiLCJhIjoiY2t6bGFuZTNoMHl3MDJza2Vvd2U2Mm84cSJ9.nYy2TJv3ChiUdpl4CLtYJA`)
        const results = data.features
        setResultsOptions(results)
      } catch (err) {
        console.log(err)
      }
    }

  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords
      setCurrentLocation({ latitude: latitude, longitude: longitude })
      setViewPort({ latitude: latitude, longitude: longitude })
    })
    getMatesHolidays()
  }, [])

  const getMatesHolidays = async () => {
    try {
      // const payload = getPayload()
      const token = window.localStorage.getItem('holiday-token')
      // const payload = 'hello'
      const { data } = await axios.get('api/holidays', {
        headers: {Authorization: `Bearer ${token}`}
      })
      setData(data)
    } catch (err) {
      console.log(err.message)
    }
  }

  const search = (e) => {
    const { center } = resultsOptions[resultsOptions.findIndex(result => result.place_name === e.target.innerText)]
    setViewPort({ latitude: center[1], longitude: center[0], zoom: 8 })
    setResultsOptions([])
    setSearchValues({search: ''})
  }
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleCheckbox = (e) => {
    e.preventDefault()
    setSearchValues({...searchValues, [e.target.name]: e.target.checked})
  }

  const filterResults = () => {
    console.log('filter')
  }

  const togglePopup = (e) => {
    console.log('clicked')
    console.log(e)
  }
  return (
    <>
      <Heading>Search</Heading>
      <Box>
        <form onSubmit={handleSubmit}>
            <Input placeholder='search' size='md' name='search' value={searchValues.search} onChange={handleChange}/>
            <Menu>
              <Button onClick={onOpen}>Filters</Button>
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Filters</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <form>
                      <FormControl>
                        <FormLabel htmlFor='holiday-type'>Holiday Type</FormLabel>
                        <Select id='holiday-type' placeholder='select holiday type' name='holidayType'onChange={handleChange}>
                          <option>Landmark</option>
                          <option>Restaurant</option>
                          <option>Event</option>
                          <option>Stay</option>
                          <option>Activity</option>
                        </Select>
                      </FormControl>
                      <Checkbox defaultIsChecked name='showMatesHolidays' onChange={handleCheckbox}>Show Mates Holidays</Checkbox>
                      <Checkbox defaultIsChecked name='showMyHolidays' onChange={handleCheckbox}>Show My Holidays</Checkbox>
                    </form>
                  </ModalBody>
                  <ModalFooter>
                    <Button onClick={filterResults, onClose}>Show Results</Button>
                  </ModalFooter>
                </ModalContent>
                  
              </Modal>
            </Menu>
            <Button type='Submit'>Search</Button>
          
          {!!resultsOptions.length && 
            <VStack spacing={4}>
              {resultsOptions.map((option, i) => {
                console.log(option)
                return(
                  <Box h='40px' key={i} onClick={search}>
                    <p>{option.place_name}</p>
                  </Box>
                )
              })}
            </VStack>
            }
        </form>
      </Box>
      <div className="map-container" >
        {currentLocation ?
          <ReactMapGl
            // initialViewState={{ ...viewPort, zoom: 10 }}
            {...viewPort}
            onMove={e => setViewPort(e.viewState)}
            style={{ width: '100%', height: '100%' }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={REACT_APP_MAPBOX_ACCESS_TOKEN}
          >
            {!!data.length && 
              data.map((holiday) => (
                  <Marker key={holiday._id} latitude={holiday.latitude} longitude={holiday.longitude} color='red' onClick={togglePopup}>
                    <Avatar src={holiday.image} name={holiday.title} showBorder size='sm' />
                  </Marker>
              ))}
              {!!showPopup && 
                <Popup latitude={showPopup.latitude} longitude={showPopup.longitude} anchor='bottom' onClose={() => setShowPopup(null)}>
                </Popup>}
            <Marker className='current-location-marker'longitude={currentLocation.longitude} latitude={currentLocation.latitude} color="green" />
          </ReactMapGl>
          :
          <p>loading your location</p>}
        
      </div>
    </>
    
  )
}

export default Search