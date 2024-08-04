'use client'

import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import {
  ButtonGroup,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { readStreamableValue } from 'ai/rsc'
import { confirmAction, saveAction } from '../action'
import SaveButton from './SaveButton'
import ConfirmButton from './ConfirmButton'

const NewProjectForm = () => {
  const [description, setDescription] = useState('')  // プロジェクト概要
  const router = useRouter()

  // 確認するときとセーブするときでアクションを分ける
  const newAction = async (formData: FormData) => {
    const files = formData.getAll('files') as File[]
    const webkitRelativePaths = files.map(file => {
      // formFileにwebkitRelativePathが含まれないため手動で追加
      return file.webkitRelativePath
    })

    // 概要生成
    if (formData.get('status') === 'confirm') {
      const response = await confirmAction(formData, webkitRelativePaths)
      for await (const content of readStreamableValue(response)) {
        setDescription(content as string)
      }
    }
    
    // セーブ
    if (formData.get('status') === 'save') {
      saveAction(formData, webkitRelativePaths)
    }
  }

  return (
    <Paper
      component="form"
      action={newAction}
      elevation={3}
      sx={{ width: 480, margin: 3, padding: 2 }}
      className="absolute bottom-0 right-0 overflow-auto"
    >
      <Stack spacing={2}>
        <TextField
          name="name"
          label="プロジェクト名"
        />
        <TextField
          key={description}  // textareaの再レンダリングを走らせ、defalutValueを更新する。
          id="outlined-multiline-flexible"
          name="description"
          label="プロジェクト概要"
          multiline
          rows={16}
          defaultValue={description}
        />
        <ButtonGroup variant="contained" color="inherit">
          <Button
            component="label"
            role={undefined}
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            className="grow"
          >
            <span>ファイルをアップロードする</span>
            <input
              type="file"
              name="files"
              // @ts-ignore
              webkitdirectory="true"
              className="hidden"
            />
          </Button>
          <ConfirmButton />
        </ButtonGroup>
        <Typography variant="caption">
          {'※ 以下で送信いただいた内容は(株)会津の暮らし研究室が行うSAVEPOINT実装に向けた実証実験等に活用されます。\
クライアント名などの固有名詞や、個人を特定できる内容は記載しないようお願いいたします。'}
        </Typography>
        <SaveButton />
        <Button variant="outlined" onClick={() => router.push('/projects')}>
          閉じる
        </Button>
      </Stack>
    </Paper>
  )
}

export default NewProjectForm
