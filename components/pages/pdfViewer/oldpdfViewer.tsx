'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import Draggable from 'react-draggable'
import { Document, Page } from 'react-pdf'
import { pdfjs } from 'react-pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface FieldData {
  fieldName: string
  partyName: string
}

const party = {
  parties: [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      address: '123 Main Street',
      title: 'Party A',
      partyType: 'Individual',
      companyName: '',
      partyId: 1,
      fields: [],
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      address: '456 Oak Street',
      title: 'Party B',
      partyType: 'Company',
      companyName: 'ABC Corporation',
      partyId: 2,
      fields: [],
    },
  ],
}

export const PDFViewer = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [numPages, setNumPages] = useState(1)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(0.75)
  const [previewLoading, setPreviewLoading] = useState(false)
  const pdfContainerRef = useRef(null)
  const [draggingItem, setDraggingItem] = useState(null)
  const dragItemRef = useRef(null)

  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [cursorLocation, setcursorLocation] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleWindowMouseMove = (event) => {
      setCoords({
        x: event.clientX,
        y: event.clientY,
      })
    }
    window.addEventListener('mousemove', handleWindowMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove)
    }
  }, [])

  const partyColorMapping = {}

  const handleDragStart = (event, fieldName, partyId) => {
    event.dataTransfer.setData('text/plain', '')
    const rect = document.getElementById(`${partyId}${fieldName}`)?.getBoundingClientRect()
    setDraggingItem({
      fieldName,
      partyId,
    })
    setcursorLocation({
      x: coords?.x - rect.x,
      y: coords?.y - rect.y,
    })
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const partyIconColors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-purple-500',
    'bg-indigo-500',
    'bg-teal-500',
  ]

  const fieldsNameArray = ['Date Signed', 'Full name', 'Email address', 'Company', 'Title', 'Signature', 'Text']

  const [parties, setParties] = useState(party.parties)

  const handleDrop = useCallback(
    (event, pageNumber, partyId, partyFieldId, status, pointer) => {
      event.preventDefault()
      const pdfContainer = pdfContainerRef.current
      const rect = pdfContainer.getBoundingClientRect()
      const x = event.clientX - rect.left - cursorLocation.x
      const y = event.clientY - rect.top - cursorLocation.y

      if (draggingItem && status === 'drag') {
        const partyId = draggingItem.partyId
        const color = partyIconColors[partyId - 1]
        const updatedParties = [...parties]
        const party = updatedParties.find((party) => party.partyId === draggingItem.partyId)

        if (party) {
          party.fields.push({
            fieldName: draggingItem.fieldName,
            pageNumber: pageNumber,
            location: { x, y, clientX: event.clientX, clientY: event.clientY, rect },
            value: '',
            filledAt: '',
            status: 'pending',
            mandatory: true,
            color: color,
            partyFieldId: (party.fields.reduce((maxId, field) => Math.max(maxId, field.partyFieldId), 0) || 0) + 1,
            placeholder: '',
          })
        }

        setParties(updatedParties)
        setDraggingItem(null)
      } else if (status === 're-drag') {
        const updatedParties = [...parties]
        const party = updatedParties.find((party) => party.partyId === partyId)

        if (party) {
          const updatedFields = party.fields.map((item) =>
            item.partyFieldId === partyFieldId ? { ...item, location: { x, y }, pageNumber: pageNumber } : item
          )

          party.fields = updatedFields
          setParties(updatedParties)
        }
      }
    },
    [draggingItem, parties]
  )

  const deletePdfDroppedFieldHandler = useCallback((partyId, partyFieldId) => {
    setParties((prevParties) =>
      prevParties.map((party) =>
        party.partyId === partyId
          ? {
              ...party,
              fields: party.fields.filter((field) => field.partyFieldId !== partyFieldId),
            }
          : party
      )
    )
  }, [])

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setSelectedFile(file)
  }

  const onDocumentLoadSuccess = (pdf) => {
    setNumPages(pdf.numPages)
    setPageNumber(1)
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset)
  }

  function previousPage() {
    changePage(-1)
  }

  function nextPage() {
    changePage(1)
  }
  return (
    <div className='flex w-full mt-4 ml-4'>
      <div className='w-full'>
        <input type='file' onChange={(event) => handleFileChange(event)} />
        {selectedFile && (
          <div className='mb-2 w-full mt-2 flex flex-wrap gap-x-6'>
            <div className='flex w-full justify-between'>
              {/* Fields */}
              <ul className='bg-white-500 list-disc overflow-y-auto pr-2' style={{ maxHeight: '78vh' }}>
                {parties?.length > 0 &&
                  parties.map((party) => {
                    partyColorMapping[party.name] = partyIconColors[party.partyId - 1]
                    return (
                      <li key={party.partyId} className='mb-2'>
                        <p className='font-bold text-black dark:text-white'>{party.name}</p>
                        <ul>
                          {fieldsNameArray.map((fieldName) => (
                            <li
                              id={`${party.partyId}${fieldName}`}
                              draggable
                              onDragStart={(e) => handleDragStart(e, fieldName, party.partyId)}
                              key={fieldName}
                              className='mb-2 flex items-center border'
                            >
                              <div
                                className={`flex h-8 w-56 cursor-pointer items-center gap-x-2 bg-gray-100 pl-3 text-sm ${
                                  party.fields.some((field) => field.fieldName === fieldName)
                                    ? 'border border-primary'
                                    : ''
                                }`}
                              >
                                <div
                                  className={`flex h-6 w-8 items-center ${
                                    partyColorMapping[party.name]
                                  } justify-center pb-1 pt-1 text-center text-white`}
                                ></div>
                                {fieldName}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </li>
                    )
                  })}
              </ul>

              {/* PDF Document */}
              <div className='flex w-full justify-center overflow-y-auto' style={{ maxHeight: '78vh' }}>
                {!previewLoading && (
                  <div
                    ref={pdfContainerRef}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, pageNumber, '', '', 'drag')}
                    className='relative'
                  >
                    <Document file={selectedFile} onLoadSuccess={onDocumentLoadSuccess}>
                      <Page pageNumber={pageNumber} renderAnnotationLayer={false} renderTextLayer={false} scale={scale}>
                        {parties?.length > 0 &&
                          parties?.map((party) =>
                            party?.fields.map((fieldItem) => {
                              const { location, color } = fieldItem
                              const scaledX = location?.x
                              const scaledY = location?.y
                              return (
                                <Draggable bounds='parent' key={`${party.partyId}-${fieldItem.partyFieldId}`}>
                                  <div
                                    ref={dragItemRef}
                                    style={{
                                      left: `${scaledX}px`,
                                      top: `${scaledY}px`,
                                      transform: `scale(${scale}) translate(-50%, -50%)`,
                                    }}
                                    className={`absolute flex items-center gap-x-1`}
                                  >
                                    <div
                                      className={`flex h-6 w-44 cursor-move items-center gap-x-2 border border-primary  bg-gray-100 pl-3 text-sm`}
                                      onClick={() => {}}
                                    >
                                      <div
                                        className={`flex h-6 w-8 items-center ${color} justify-center  text-center text-white`}
                                      ></div>
                                      {fieldItem.fieldName}
                                      {fieldItem?.mandatory && '*'}
                                    </div>
                                    <button
                                      type='button'
                                      className={`hover:bg-gary-100 h-6 bg-gray-100 px-3 text-black`}
                                      onClick={() => {
                                        deletePdfDroppedFieldHandler(party?.partyId, fieldItem.partyFieldId)
                                      }}
                                    >
                                      delete
                                    </button>
                                  </div>
                                </Draggable>
                              )
                            })
                          )}
                      </Page>
                    </Document>

                    <div className='fixed left-1/2 top-4 z-40 flex w-3/4 w-full -translate-x-1/2 transform flex-row items-center justify-center gap-2'>
                      <button
                        className='bg-transparent text-black dark:text-white'
                        type='button'
                        disabled={pageNumber <= 1}
                        onClick={previousPage}
                      >
                        {'<'}
                      </button>
                      <p className='bg-transparent text-xl text-black dark:text-white'>
                        Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
                      </p>
                      <button
                        className='bg-transparent text-black dark:text-white'
                        type='button'
                        disabled={pageNumber >= numPages}
                        onClick={nextPage}
                      >
                        {'>'}
                      </button>
                      <label className='hidden bg-transparent text-xl text-black dark:text-white sm:block'>
                        <div className='flex flex-row items-center justify-center'>
                          Zoom:
                          <input
                            type='range'
                            min='0.50'
                            max='1'
                            step='0.10'
                            value={scale}
                            onChange={(e) => setScale(parseFloat(e.target.value))}
                            className='max-w-5rem custom-range h-8 flex-1 cursor-pointer'
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
