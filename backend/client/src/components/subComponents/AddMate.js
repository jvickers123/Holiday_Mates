import React, { useState} from 'react'
import { Text, FormControl, Center, FormLabel, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AddMate = ({ listenToChild }) => {
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  //STATE
  const [isError, setIsError] = useState('')

  const [formData, setFormData] = useState({
    mateUsername: '',
    mateToken: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setIsError('')
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = window.localStorage.getItem('holiday-token')
      if (!token) navigate('/login')
      await axios.post('api/mates', formData, { headers: {Authorization: `Bearer ${token}` } })
      setFormData({
        mateUsername: '',
        mateToken: '',
      })
      listenToChild()
      toast({
        title: 'Mate Added!',
        description: 'Now you can see all their wonderful holidays',
        status: 'success',
        duration: 9000,
        isClosable: true
      })
      onClose()
    } catch (err) {
      console.log(err)
      setIsError(err.response.data.message)
    }
  } 
  return (
    <div className="AddMate-container">
      <Button onClick={onOpen}>Add Mate</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign='center'>Add Mate</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
            <FormControl isRequired >
              <FormLabel htmlFor='mateUsername'>Mates Username</FormLabel>
              <Input name='mateUsername' placeholder='Enter Mates Username' defaultValue={formData.mateUsername} onChange={handleChange}/>
            </FormControl>

            <FormControl isRequired >
              <FormLabel htmlFor='mateToken'>Your Mate&apos;s MatesCode</FormLabel>
              <Input name='mateToken' placeholder='Enter Mates Token'defaultValue={formData.mateToken} onChange={handleChange}/>
            </FormControl>
            {!!isError && <Text color='red'>{isError}</Text>}
            <Center><Button type='submit'>Add Mate</Button></Center>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default AddMate