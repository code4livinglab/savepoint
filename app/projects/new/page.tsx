import NewProjectForm from './_component/NewProjectForm'
import { action } from './action'

const NewProjectPage = () => {
  return (
    <NewProjectForm action={action} />
  )
}

export default NewProjectPage
