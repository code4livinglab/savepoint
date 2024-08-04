// @ts-nocheck
"use client"

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import * as THREE from 'three'

import ToScreenPosition from './ToScreenPosition'

function isObjectInView(camera, obj) {
  const directionToObject = new THREE.Vector3().subVectors(
    obj.position,
    camera.position
  )
  const cameraDirection = new THREE.Vector3()
  camera.getWorldDirection(cameraDirection)

  return directionToObject.angleTo(cameraDirection) < Math.PI / 2
}

function isObjectVisible(camera, obj, maxDistance) {
  const distance = camera.position.distanceTo(obj.position)
  return distance < maxDistance
}

const Explore = ({
  projects,
}) => {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const isDragging = useRef(false)
  const previousMousePosition = useRef({ x: 0, y: 0 })
  const [objects, setObjects] = useState([])

  // Three.jsのオブジェクトを作成
  useEffect(() => {
    const objects = [];

    for (const project of projects) {
      const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
      const material = new THREE.MeshBasicMaterial({
        color: Math.random() * 0xffffff,
      })

      const object = new THREE.Mesh(geometry, material)
      object.projectId = project.id
      object.name = project.name
      object.position.set(
        project.embedding[0] * 10,
        project.embedding[1] * 10,
        project.embedding[2] * 10,
      )
      objects.push(object)
    }
    setObjects(objects)
  }, [projects]);

  useEffect(() => {
    // 基本設定
    sceneRef.current = new THREE.Scene()
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    cameraRef.current.position.z = 5
    rendererRef.current = new THREE.WebGLRenderer()
    rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    mountRef.current.appendChild(rendererRef.current.domElement)

    // レイキャスターの設定
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    // アニメーションループ
    let animationFrameId
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }

    animate()

    // マウスホイールでの移動処理
    const onKeyDown = (event) => {
      const speed = 0.2 // 移動速度
      const direction = new THREE.Vector3()
      const right = new THREE.Vector3()
      // 今向いている前方向を計算
      cameraRef.current.getWorldDirection(direction)
      right.crossVectors(direction, cameraRef.current.up)

      switch(event.key) {
        case 'w':
        case 'ArrowUp':
          cameraRef.current.position.addScaledVector(direction, speed)
          break
        case 's':
        case 'ArrowDown':
          cameraRef.current.position.addScaledVector(direction, -speed)
          break
        case 'a':
        case 'ArrowLeft':
          cameraRef.current.position.addScaledVector(right, -speed)
          break
        case 'd':
        case 'ArrowRight':
          cameraRef.current.position.addScaledVector(right, speed)
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', onKeyDown)

    // クリックイベント処理 ボタンでするからなくすかも
    const onMouseClick = (event) => {
      // マウス位置の正規化
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
      // console.log("x = %f: y = %f", mouse.x, mouse.y);

      // レイキャスターを更新し、交差オブジェクトを取得
      raycaster.setFromCamera(mouse, cameraRef.current)

      // [debug] ArrowHelperの方向をレイキャスターの方向に設定
      // arrowHelper.setDirection(raycaster.ray.direction);

      const intersects = raycaster.intersectObjects(sceneRef.current.children)

      if (intersects.length > 0) {
        console.log(intersects[0].object.name)
      }
    }
    window.addEventListener('click', onMouseClick)

    // ドラッグで首振りする処理
    const onMouseDown = (event) => {
      isDragging.current = true
      previousMousePosition.current = { x: event.clientX, y: event.clientY }
    }
    window.addEventListener('mousedown', onMouseDown)

    const onMouseMove = (event) => {
      if (isDragging.current) {
        const deltaX = (previousMousePosition.current.x - event.clientX) * 0.1
        const deltaY = (previousMousePosition.current.y - event.clientY) * 0.1

        // カメラのローカル軸を使用して左右に回転
        cameraRef.current.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), deltaX * (Math.PI / 180))

        // カメラのローカルX軸を使用して上下に回転
        cameraRef.current.rotateX(deltaY * (Math.PI / 180))
        cameraRef.current.updateProjectionMatrix()
        previousMousePosition.current = { x: event.clientX, y: event.clientY }
      }
    }
    window.addEventListener('mousemove', onMouseMove)

    const onMouseUp = () => {
      isDragging.current = false
    }
    window.addEventListener('mouseup', onMouseUp)

    // ウィンドウサイズ変更時のイベント処理
    const onWindowResize = () => {
      cameraRef.current.aspect = window.innerWidth / window.innerHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onWindowResize)

    // コンポーネントがアンマウントされる際のクリーンアップ
    return () => {
      window.removeEventListener('click', onMouseClick)
      window.removeEventListener('resize', onWindowResize)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      mountRef.current.removeChild(rendererRef.current.domElement)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // オブジェクト描画
  useEffect(() => {
    // 既存オブジェクトのリセット
    sceneRef.current.children = [];
    
    // 新規オブジェクトの追加
    objects.forEach((obj) => {
      sceneRef.current.add(obj)
    })
  }, [objects])

  // オブジェクト名を表示するコンポーネント
  const ObjectLabel = ({ obj, camera, renderer }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 })
    // // 選択ターゲット前に移動する処理
    const moveToTarget = (targetPosition) => {
      cameraRef.current.lookAt(targetPosition) // オブジェクトの方向を向く
    }

    // project名のクリックイベント
    const onButtonClick = (targetObject) => {
      moveToTarget(targetObject.position);
      setSelectedProject(targetObject.projectId)
    }

    useEffect(() => {
      let renderAnimationFrameId
      const updatePosition = () => {
        // isObjectVisibleの第三引数は名前表示するオブジェクトの距離上限
        if (
          isObjectInView(cameraRef.current, obj) &&
          isObjectVisible(cameraRef.current, obj, 15)
        ) {
          const pos = ToScreenPosition(
            obj,
            cameraRef.current,
            rendererRef.current
          )
          setPosition(pos)
        } else {
          // オブジェクトが背後にある場合、位置をリセット
          setPosition({ x: -1000, y: -1000 })
        }
      }

      updatePosition()

      // レンダリンググループで位置を更新
      const renderLoop = () => {
        updatePosition()
        renderAnimationFrameId = requestAnimationFrame(renderLoop)
      }

      renderLoop()

      return () => {
        cancelAnimationFrame(renderAnimationFrameId)
      }
    }, [obj, camera, renderer])

    return (
      <div
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <Link className="text-white" href={`/projects/${obj.projectId}`}>
          {obj.name}
        </Link>
      </div>
    )
  }

  return (
    <div ref={mountRef}>
    {objects.map((obj, index) => (
      <ObjectLabel
        key={index}
        obj={obj}
        camera={cameraRef.current}
        renderer={rendererRef.current}
      />
    ))}  
    </div>
  )
}

export default Explore
