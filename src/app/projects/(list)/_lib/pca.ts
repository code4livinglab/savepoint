import { PCA } from 'ml-pca'
import { normalize } from './normalize'

// 次元削減
export const pca = (array2D: number[][]) => {
  const pca = new PCA(array2D)
  const matrix = pca.predict(array2D)
  const normalizedMatrix = normalize(matrix, 300)
  const newArray2D: number[][] = normalizedMatrix.to2DArray()
  return newArray2D
}
