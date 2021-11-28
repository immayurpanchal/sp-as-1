import { useEffect, useReducer, useState } from 'react'
import './App.css'
import DataList from './components/DataList'
import Input from './components/Input'
import useGooglePlace from './hooks/useGooglePlace'

const initialState = {
  bedroom: 1,
  bathroom: 1,
  address: '',
  description: ''
}

const formReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'manual':
      return { ...state, [action.name]: action.value }
    case 'csv':
      return { ...action.value }
    default:
      return state
  }
}

const App = () => {
  const [isFormVisible, setFormVisibility] = useState(false)
  const [state, dispatch] = useReducer(formReducer, initialState)
  const [csvData, setCsvData] = useState(null)
  const [isDataValid, setDataValid] = useState(false)
  const [isFormSubmitted, setFormSubmit] = useState(false)
  const [images, setImages] = useState([])
  const [featuredImage, setFeaturedImage] = useState(null)
  const { places, handlePlaceSearch } = useGooglePlace()

  const handleSubmit = e => {
    if (e.target.checkValidity()) {
      setDataValid(true)
    }
    e.preventDefault()

    e.target.classList.add('was-validated')
  }

  const handleDataListRef = ref => {
    if (!ref.current) return
    ref.current.value = state.address
  }

  const renderForm = () => {
    return (
      <form
        onSubmit={handleSubmit}
        className='mt-5 needs-validation'
        noValidate
        name='form-sp'>
        <div className='mb-5 row'>
          <DataList
            label='Address'
            id='address'
            placeholder='Type to search the address'
            options={places}
            onSelect={value =>
              dispatch({ type: 'manual', name: 'address', value })
            }
            errorMessage='Address must be a valid address'
            reference={handleDataListRef}
          />
        </div>
        <div className='mb-5 row'>
          <Input
            required
            key='bedroom'
            min='1'
            max='10'
            type='number'
            label='Bedroom'
            id='bedroom'
            value={state.bedroom || 0}
            onChange={e =>
              dispatch({
                type: 'manual',
                name: e.target.name,
                value: +e.target.value
              })
            }
            validate={({ target: { value } }) => +value >= 5 && +value <= 10}
            errorMessage='Bedroom must be between 5 and 10'
          />
        </div>
        <div className='mb-5 row'>
          <Input
            required
            key='bathroom'
            min='1'
            max='5'
            type='number'
            id='bathroom'
            label='Bathroom'
            value={state.bathroom || 0}
            validate={({ target: { value } }) => +value >= 1 && +value <= 5}
            onChange={e =>
              dispatch({
                type: 'manual',
                name: e.target.name,
                value: +e.target.value
              })
            }
            errorMessage='Bathroom must be between 1 and 5'
          />
        </div>
        <div className='mb-5 row'>
          <Input
            type='textarea'
            key='description'
            className='form-control'
            id='description'
            label='Description'
            value={state.description || ''}
            validate={() => true}
            onChange={e =>
              dispatch({
                type: 'manual',
                name: e.target.name,
                value: e.target.value
              })
            }
          />
        </div>
        <div className='d-flex justify-content-center'>
          <button className='btn btn-primary mx-3 col-4' type='submit'>
            Validate
          </button>
          <button
            className={`btn btn-primary col-4 ${
              !isDataValid ? 'disabled' : ''
            }`}
            type='button'
            onClick={() => setFormSubmit(true)}>
            Submit
          </button>
        </div>
      </form>
    )
  }

  const getBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        resolve(reader.result)
      }
      reader.onerror = error => {
        reject(error)
      }
    })

  const renderDragDrop = () => {
    return (
      <div
        id='drag-region'
        className='shadow mt-5 border-3 mb-5'
        style={{ height: '200px' }}
        onDrop={e => {
          e.preventDefault()
          e.stopPropagation()

          const files = Array.from(e.dataTransfer.files)
          if (images.length + files.length > 4) {
            return alert('You can only upload 4 images')
          }

          // Intentionally set check for only PNG images
          // Based on requirement we can change this to accept any image type
          if (files.some(file => file.type !== 'image/png')) {
            return alert('Only PNG files are allowed')
          }

          const imagePromises = files.map(async file => {
            return await getBase64(file)
          })
          Promise.allSettled(imagePromises)
            .then(results => {
              const images64 = results.map(result => result.value)
              setImages(prevImages => [...prevImages, ...images64])
            })
            .catch(err => {
              console.log(err)
            })
        }}
        onDragOver={e => e.preventDefault()}>
        <div className=''>Drag & Drop images to upload</div>
      </div>
    )
  }

  const renderImages = () => {
    return (
      <div className='d-flex flex-wrap'>
        {images.map((image, index) => {
          return (
            <div
              className='form-check mt-5 d-flex align-items-center'
              key={`featured-image-${index}`}>
              <input
                type='radio'
                name='featured-image'
                className='form-check-input'
                id={`featured-image-${index}`}
                onChange={e =>
                  setFeaturedImage({ id: e.target.id, url: image })
                }
              />
              <label htmlFor='featured-image' className='form-check-label mx-3'>
                <img
                  src={image}
                  alt='drag'
                  key={index}
                  width='300px'
                  height='150px'
                />
              </label>
            </div>
          )
        })}
      </div>
    )
  }

  const readFile = file => {
    try {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result.split('\n')[0]
        const propertyData = result.split(';')
        if (file.type !== 'text/csv' && propertyData.length < 4)
          return alert(
            'File must be a valid CSV file separated with ; and must have 4 columns'
          )
        const [address, bedroom, bathroom, description] = propertyData
        setCsvData({ address, bedroom, bathroom, description })
        setFormVisibility(true)
      }
      reader.readAsText(file)
    } catch (error) {
      console.log(error)
    }
  }

  const viewSubmittedForm = () => {
    console.log({ ...state, images, featuredImage })
  }

  useEffect(() => {
    if (!isFormVisible || !csvData) return

    dispatch({
      type: 'csv',
      value: {
        address: csvData.address,
        bedroom: +csvData.bedroom,
        bathroom: +csvData.bathroom,
        description: csvData.description
      }
    })
  }, [csvData, isFormVisible])

  useEffect(() => {
    handlePlaceSearch()
  }, [])

  return (
    <div className='App container-sm card border-secondary p-5 my-5'>
      <div className='d-flex flex-column'>
        <div className='d-sm-flex justify-content-center align-items-center'>
          <button
            className='btn btn-primary mx-3'
            onClick={() => setFormVisibility(prevState => !prevState)}
            type='button'>
            Add Manually
          </button>
          <span>OR</span>
          <form
            onSubmit={e => {
              e.preventDefault()
            }}
            name='theForm'
            className='mx-3'>
            <Input
              className='form-control'
              type='file'
              id='formFile'
              accept='.csv'
              onChange={e => {
                document.querySelector('[name=theForm]').requestSubmit()
                readFile(e.target.files[0])
              }}
              validate={e => e.target.files[0]?.type === 'text/csv'}
              errorMessage='File must be a CSV file'
            />
          </form>
        </div>
        {isFormVisible && renderForm()}
        {isDataValid && isFormSubmitted && renderImages()}
        {isDataValid && isFormSubmitted && renderDragDrop()}
        {isDataValid && isFormSubmitted && (
          <button onClick={viewSubmittedForm} className='btn btn-primary mb-5'>
            Final Submit
          </button>
        )}
      </div>
    </div>
  )
}

export default App
