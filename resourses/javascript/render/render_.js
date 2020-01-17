let scene, renderer, camera, pointLight, cameraControl, world
let statsUI
let creeperObj = []
const creeperPosition = [[0,0]]

// PointerLockControls setting
let controls
let moveForward = false
let moveBackward = false
let moveLeft = false
let moveRight = false
let canJump = false
let raycaster
let prevTime = Date.now() // 初始時間
let velocity = new THREE.Vector3() // 移動速度向量
let direction = new THREE.Vector3() // 移動方向向量

const textureLoader = new THREE.TextureLoader()
const loader = new THREE.OBJLoader()
const gltfLoader = new THREE.GLTFLoader()

// 初始化場景、渲染器、相機、物體
function init() {
    // 建立場景
    scene = new THREE.Scene()

    // 建立渲染器
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight) // 場景大小
    renderer.setClearColor(0xeeeeee, 1.0) // 預設背景顏色
    renderer.shadowMap.enable = true // 陰影效果
    // 將渲染器的 DOM 綁到網頁上
    document.body.appendChild(renderer.domElement)

    // init camera
    initCamera();

    // init PointLight
    initPointLight();

    // fps status
    statsUI = initStats();

    // 建立 OrbitControls
    cameraControl = new THREE.OrbitControls(camera, renderer.domElement)
    cameraControl.enableDamping = true // 啟用阻尼效果
    cameraControl.dampingFactor = 0.25 // 阻尼系數

    // init physical engine
    initWorld();

    creatGround();

    createCreeper(1);


    let ambientLight = new THREE.AmbientLight(0x404040) // soft white light
    scene.add(ambientLight)
    // 簡單的 spotlight 照亮物體
    let spotLight = new THREE.SpotLight(0xffffff, 5, 100)
    spotLight.position.set(-10, 20, 20)
    scene.add(spotLight)

    createTower();
    initGLTF();
    initPointerLockControls();
}

function createCreeper(num) {
    for (let i = 0; i < num; i++) {
      creeperObj[i] = new Creeper(0.4, 1, creeperPosition[i])
      scene.add(creeperObj[i].creeper)
      world.addBody(creeperObj[i].headBody)
      world.addBody(creeperObj[i].bodyBody)
      world.addBody(creeperObj[i].leftFrontLegBody)
      world.addBody(creeperObj[i].leftBackLegBody)
      world.addBody(creeperObj[i].rightFrontLegBody)
      world.addBody(creeperObj[i].rightBackLegBody)
      world.addConstraint(creeperObj[i].neckJoint)
      world.addConstraint(creeperObj[i].leftFrontKneeJoint)
      world.addConstraint(creeperObj[i].leftBackKneeJoint)
      world.addConstraint(creeperObj[i].rightFrontKneeJoint)
      world.addConstraint(creeperObj[i].rightBackKneeJoint)
    }
  }

// init camera
function initCamera() {
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    )
    camera.position.set(10, 10, 10)
    camera.lookAt(scene.position)
}

// init PointLight
function initPointLight(params) {
    // 建立光源
    pointLight = new THREE.PointLight(0xffffff)
    pointLight.position.set(10, 10, -10)
    scene.add(pointLight)
}

// 建立監測器
function initStats() {
    const stats = new Stats()
    stats.setMode(0) // FPS mode
    document.getElementById('stats').appendChild(stats.domElement)
    return stats
}

// init physical engine
function initWorld() {
    // 建立物理世界
    world = new CANNON.World()

    // 設定重力場為 y 軸 -9.8 m/s²
    world.gravity.set(0, -9.8, 0)

    // 碰撞偵測
    world.broadphase = new CANNON.NaiveBroadphase()
}

function initGLTF() {
    gltfLoader.load('/resourses/gltf/untitled.gltf', function (gltf) {
        // console.log(gltf);
        gltf.scene.position.set(5, 0, 2);
        // physicalEngine.add(g)
        scene.add(gltf.scene);

    })
}

function creatGround() {
    // 建立地板剛體
    let groundShape = new CANNON.Plane()
    let groundCM = new CANNON.Material()
    let groundBody = new CANNON.Body({
        mass: 0,
        shape: groundShape,
        material: groundCM
    })
    // setFromAxisAngle 旋轉 x 軸 -90 度
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    world.add(groundBody)

    const groundTexture = textureLoader.load('/resourses/images/grasslight-big.jpg')
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping
    groundTexture.repeat.set(25, 25)
    groundTexture.anisotropy = 16

    const groundMaterial = new THREE.MeshLambertMaterial({
        map: groundTexture
    })

    ground = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(1000, 1000),
        groundMaterial
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    ground.name = 'floor'
    scene.add(ground)
}

// 監聽螢幕寬高來做簡單 RWD 設定
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

function input() {
    jQuery(function ($) {
        var currentMousePos = {
            x: -1,
            y: -1
        };
        $(document).mousedown(function (event) {
            currentMousePos.x = event.pageX;
            currentMousePos.y = event.pageY;
            // console.log("X :: " + currentMousePos.x);x
            // console.log("Y :: " + currentMousePos.y);
        });

        // ELSEWHERE, your code that needs to know the mouse position without an event
        if (currentMousePos.x < 10) {

        }
    });
}

function initPointerLockControls(playerBody) {
    // 鼠標鎖定初始化
    controls = new THREE.PointerLockControls(camera,playerBody)
    controls.getObject().position.set(10, 0, 5)
    scene.add(controls.getObject())

    const onKeyDown = function (event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = true
                break
            case 37: // left
            case 65: // a
                moveLeft = true
                break
            case 40: // down
            case 83: // s
                moveBackward = true
                break
            case 39: // right
            case 68: // d
                moveRight = true
                break
            case 32: // space
                if (canJump === true) velocity.y += 350 // 跳躍高度
                canJump = false
                break
        }
    }
    const onKeyUp = function (event) {
        switch (event.keyCode) {
            case 38: // up
            case 87: // w
                moveForward = false
                break
            case 37: // left
            case 65: // a
                moveLeft = false
                break
            case 40: // down
            case 83: // s
                moveBackward = false
                break
            case 39: // right
            case 68: // d
                moveRight = false
                break
        }
    }
    document.addEventListener('keydown', onKeyDown, false)
    document.addEventListener('keyup', onKeyUp, false)

    // 使用 Raycaster 實現簡單碰撞偵測
    raycaster = new THREE.Raycaster(
        new THREE.Vector3(),
        new THREE.Vector3(0, -1, 0),
        0,
        10
    )
}

function helpers() {
    // axes
    var axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    // grid
    var size = 30;
    var divisions = 30;
    var gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    // camera
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var helper = new THREE.CameraHelper(camera);
    scene.add(helper);

    // light
    var sphereSize = 1;
    var pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
    scene.add(pointLightHelper);
}

function createTower() {
    let towerBumpMat = new THREE.MeshStandardMaterial({
        metalness: 0.05,
        roughness: 0.9
    })
    towerBumpMat.map = textureLoader.load(
        '/resourses/obj/tower/textures/Wood_Tower_Col.jpg'
    )
    // towerBumpMat.bumpMap = textureLoader.load(
    //   './obj/tower/textures/Wood_Tower_Nor.jpg'
    // )
    // towerBumpMat.bumpScale = 1
    loader.load('/resourses/obj/tower/tower.obj', function (loadedMesh) {
        loadedMesh.children.forEach(function (child) {
            child.material = towerBumpMat
            child.geometry.computeFaceNormals()
            child.geometry.computeVertexNormals()
        })
        loadedMesh.scale.set(1, 1, 1)
        loadedMesh.position.set(10, -0.75, 0)
        loadedMesh.castShadow = true
        scene.add(loadedMesh)
    })
}

function walker(target) {
    if(moveForward){
        target.position.set();
    }
    if(moveBackward){
        target.position.set();
    }
    if(moveLeft){
        target.position.set();
    }
    if(moveRight){
        target.position.set();
    }
    // if(canJump){
    //     console.log("Asdasd")
    // }
}

function pointerLockControlsRender() {
    // 計算時間差
    const time = Date.now()
    const delta = (time - prevTime) / 1000 // 大約為 0.016

    // 設定初始速度變化
    velocity.x -= velocity.x * 10.0 * delta
    velocity.z -= velocity.z * 10.0 * delta
    velocity.y -= 9.8 * 100.0 * delta // 預設墜落速度

    // 判斷按鍵朝什麼方向移動，並設定對應方向速度變化
    direction.z = Number(moveForward) - Number(moveBackward)
    direction.x = Number(moveLeft) - Number(moveRight)
    // direction.normalize() // 向量正規化（長度為 1），確保每個方向保持一定移動量
    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta

    // 根據速度值移動控制器位置
    controls.getObject().translateX(velocity.x * delta)
    controls.getObject().translateY(velocity.y * delta)
    controls.getObject().translateZ(velocity.z * delta)

    prevTime = time
}

const timeStep = 1.0 / 60.0 // seconds
// 渲染場景
function render() {
    requestAnimationFrame(render)
    world.step(timeStep)
    statsUI.update();
    walker();
    // pointerLockControlsRender();
    input()
    
    cameraControl.update() // 需設定 update
    renderer.render(scene, camera)
}

// main --- begin
init();
window.onload = function () {
    render();
    helpers()
}

// main --- end