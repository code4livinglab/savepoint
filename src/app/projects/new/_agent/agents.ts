import { generateObject, streamText, ImagePart, TextPart } from 'ai'
import { createStreamableValue } from 'ai/rsc'
import { wrapAISDKModel } from 'langsmith/wrappers/vercel'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

const vercelModel = openai('gpt-4o-mini')
const modelWithTracing = wrapAISDKModel(vercelModel)

// File Agent
export const generateFilesObjectAgent = async (filePaths: string[]) => {
  const { object } = await generateObject({
    model: modelWithTracing,
    schema: z.object({
      files: z.array(
        z.string(),
      ),
    }),
    system: `プロジェクトの概要文を作成するため、与えられた複数のファイルから、\
プロジェクト全体を最もよく説明するファイルを5個ピックアップしてください。
`,
    messages: [{ role: 'user', content: `${filePaths}` }],
  })

  return object.files
}

// Summary Agent
export const streamSummaryTextAgent = async (
  text: string,
  images: Buffer[],
) => {
  // Multi-modal contents
  const textPart: TextPart = { type: 'text', text: text }
  const imageParts: ImagePart[] = images.map((image) => ({
    type: 'image',
    image: image,
  }))

  const { textStream } = await streamText({
    model: modelWithTracing,
    system: `プロジェクトの内容を簡単に見返せるよう、\
プロジェクトで利用したデータをもとにプロジェクトの概要を整理したいです。
共有された **すべてのテキストと画像について** 、\
内容を以下の形式にまとめて出力してください。

## 概要

{ プロジェクトの概要を記入する。 }

## 背景

{ プロジェクトの背景を記入する。 }

## 目的

{ プロジェクトの目的を記入する。 }

## 解決策

{ プロジェクトの解決策を記入する。 }

どんな場合でも、必ず上記の形式に従って出力する必要があります。
`,
    messages: [{
      role: 'user',
      content: [textPart, ...imageParts],  // Multi-modal input
    }],
  })

  const stream = createStreamableValue(textStream)
  return stream.value
}
