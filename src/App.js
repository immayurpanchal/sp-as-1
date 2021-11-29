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
    if (!ref.current) {
      return
    }
    ref.current.value = state.address
  }

  const renderForm = () => {
    return (
      <form
        noValidate
        className='mt-5 needs-validation'
        name='form-sp'
        onSubmit={handleSubmit}>
        <div className='mb-5 row'>
          <DataList
            errorMessage='Address must be a valid address'
            id='address'
            label='Address'
            options={places}
            placeholder='Type to search the address'
            reference={handleDataListRef}
            onSelect={value =>
              dispatch({ type: 'manual', name: 'address', value })
            }
          />
        </div>
        <div className='mb-5 row'>
          <Input
            key='bedroom'
            required
            errorMessage='Bedroom must be between 1 and 10'
            id='bedroom'
            label='Bedroom'
            max='10'
            min='1'
            type='number'
            validate={({ target: { value } }) => +value >= 1 && +value <= 10}
            value={state.bedroom || 0}
            onChange={e =>
              dispatch({
                type: 'manual',
                name: e.target.name,
                value: +e.target.value
              })
            }
          />
        </div>
        <div className='mb-5 row'>
          <Input
            key='bathroom'
            required
            errorMessage='Bathroom must be between 1 and 5'
            id='bathroom'
            label='Bathroom'
            max='5'
            min='1'
            type='number'
            validate={({ target: { value } }) => +value >= 1 && +value <= 5}
            value={state.bathroom || 0}
            onChange={e =>
              dispatch({
                type: 'manual',
                name: e.target.name,
                value: +e.target.value
              })
            }
          />
        </div>
        <div className='mb-5 row'>
          <Input
            key='description'
            className='form-control'
            id='description'
            label='Description'
            type='textarea'
            validate={() => true}
            value={state.description || ''}
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
          <button
            className='btn btn-primary mx-3 col-4'
            id='btn-validate'
            type='submit'>
            Validate
          </button>
          <button
            className={`btn btn-primary col-4 ${
              !isDataValid ? 'disabled' : ''
            }`}
            id='btn-submit'
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
        className='shadow mt-5 border-3 mb-5'
        id='drag-region'
        style={{ height: '200px' }}
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault()
          e.stopPropagation()

          const files = Array.from(e.dataTransfer.files)
          if (images.length + files.length > 4) {
            // eslint-disable-next-line no-alert
            return alert('You can only upload 4 images')
          }

          // Intentionally set check for only PNG images
          // Based on requirement we can change this to accept any image type
          if (files.some(file => file.type !== 'image/png')) {
            // eslint-disable-next-line no-alert
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
              console.error(err)
            })
          return 0
        }}>
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
              key={`featured-image-${index}`}
              className='form-check mt-5 d-flex align-items-center'>
              <input
                className='form-check-input'
                id={`featured-image-${index}`}
                name='featured-image'
                type='radio'
                onChange={e =>
                  setFeaturedImage({ id: e.target.id, url: image })
                }
              />
              <label className='form-check-label mx-3' htmlFor='featured-image'>
                <img
                  key={index}
                  alt='drag'
                  height='150px'
                  src={image}
                  width='300px'
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
        if (file.type !== 'text/csv' || propertyData.length !== 4) {
          // eslint-disable-next-line no-alert
          return alert(
            'Only CSV separated with ; and must have 4 columns is allowed'
          )
        }
        const [address, bedroom, bathroom, description] = propertyData
        setCsvData({ address, bedroom, bathroom, description })
        return setFormVisibility(true)
      }
      reader.readAsText(file)
    } catch (error) {
      console.error(error)
    }
  }

  const viewSubmittedForm = () => {
    // eslint-disable-next-line no-console
    console.log({ ...state, images, featuredImage })
  }

  useEffect(() => {
    if (!isFormVisible || !csvData) {
      return
    }

    // Handled CSV file invalid data to some default values
    dispatch({
      type: 'csv',
      value: {
        address: csvData.address || '',
        bedroom: +csvData.bedroom || 1,
        bathroom: +csvData.bathroom || 1,
        description: csvData.description || ''
      }
    })
  }, [csvData, isFormVisible])

  useEffect(() => {
    handlePlaceSearch()
  }, [handlePlaceSearch])

  return (
    <div className='App container-sm card border-secondary p-5 my-5'>
      <div className='d-flex flex-column'>
        <div className='d-sm-flex justify-content-center align-items-center'>
          <button
            className='btn btn-primary mx-3'
            id='addManually'
            type='button'
            onClick={() => setFormVisibility(prevState => !prevState)}>
            Add Manually
          </button>
          <span>OR</span>
          <form
            className='mx-3'
            name='theForm'
            onSubmit={e => {
              e.preventDefault()
            }}>
            <Input
              accept='.csv'
              className='form-control'
              errorMessage='File must be a CSV file'
              id='formFile'
              type='file'
              validate={e => e.target.files[0]?.type === 'text/csv'}
              onChange={e => {
                document.querySelector('[name=theForm]').requestSubmit()
                readFile(e.target.files[0])
              }}
            />
          </form>
        </div>
        {isFormVisible && renderForm()}
        {isDataValid && isFormSubmitted && renderImages()}
        {isDataValid && isFormSubmitted && renderDragDrop()}
        {isDataValid && isFormSubmitted && (
          <button
            className='btn btn-primary mb-5'
            id='finalSubmit'
            onClick={viewSubmittedForm}>
            Final Submit
          </button>
        )}
      </div>
    </div>
  )
}

export default App
