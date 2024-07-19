// ベクトルの正規化
export const normalize: any = (matrix: any, range: number = 1) => {
  const max = matrix.max()
  const min = matrix.min()
  return matrix.sub(min).div(max - min).sub(0.5).mul(range)
}
