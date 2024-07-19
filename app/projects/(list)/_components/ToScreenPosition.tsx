"use client"
import * as THREE from 'three'

// @ts-ignore
function ToScreenPosition(obj, camera, renderer) {
  const vector = new THREE.Vector3()

  // オブジェクトの位置をワールド座標からスクリーン座標へ変換
  const widthHalf = 0.5 * renderer.getContext().canvas.width
  const heightHalf = 0.5 * renderer.getContext().canvas.height

  obj.updateMatrixWorld()
  vector.setFromMatrixPosition(obj.matrixWorld)
  vector.project(camera)

  vector.x = vector.x * widthHalf + widthHalf
  vector.y = -(vector.y * heightHalf) + heightHalf

  return {
    x: vector.x,
    y: vector.y,
  }
}

export default ToScreenPosition
