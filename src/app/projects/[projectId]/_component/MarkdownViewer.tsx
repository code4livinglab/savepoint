import Markdown from 'react-markdown'
import { Project } from '@/src/app/_types/project'

export const MarkdownViewer = ({
  project,
}: {
  project: Project,
}) => {
  return (
    <Markdown className="prose prose-sm prose-invert">
      {project.description}
    </Markdown>
  )
}
