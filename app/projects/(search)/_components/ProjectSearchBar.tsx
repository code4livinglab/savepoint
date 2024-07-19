'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import ProjectSearchList from './ProjectSearchList'
import ProjectSearchForm from './ProjectSearchForm'
import { action } from '../action'

const ProjectSearchBar = () => {
  const [projectList, formAction] = useFormState(action, [])
  const [diplayList, setDisplaysList] = useState(false)

  const newFormAction = (formData: FormData) => {
    formAction(formData)
    setDisplaysList(true)
  }

  const handleClose = () => {
    setDisplaysList(false)
  }

  return (
    <div className="absolute top-0 m-5">
      <ProjectSearchForm formAction={newFormAction} />
      {diplayList && projectList.length > 0 && (
        <ProjectSearchList projectList={projectList} onClose={handleClose} />
      )}
    </div>
  )
}

export default ProjectSearchBar
