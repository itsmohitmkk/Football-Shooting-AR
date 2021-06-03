// Component that places trees where the ground is clicked
let isclicked = false
let secondclick = false
let totalthrown = 0

export const tapPlaceComponent = {
  init() {
    const placeobj = document.getElementById('placeobj')
    const footballground = document.getElementById('footballground')
    const finaldiv = document.getElementById('finaldiv')
    const startdiv = document.getElementById('startdiv')
    const plus1 = document.getElementById('plus1')
    const logo = document.getElementById('Logo')
    const plate = document.getElementById('footballball')
    
    const misscount = document.getElementById('miss')
    const hitcount = document.getElementById('hit')
    
     const ele = document.getElementById('TimerAnim')
    const elem = document.getElementById('timerDiv')
    const score = document.getElementById('score')
    const tap = document.getElementById('tap')
    let newElemen
    let intial4
    let newElement
    // tap.style.visibility = 'visible'
    startdiv.style.display = 'block'
    const startbtn = document.getElementById('startbtn')
    startbtn.addEventListener('click', (eve) => {
      startdiv.style.display = 'none'
    })
    logo.style.visibility = 'visible'

    footballground.setAttribute('visible', 'false')
    let hitno = 0
    let missno = 0
    let miss
    let hit
    // console.log('isclicked before event', isclicked)

    // whenever user taps on placeobj we put bowls in that position
    placeobj.addEventListener('click', (event) => {
      if (!isclicked && !secondclick) {
        // remove placeobj sprite
        placeobj.setAttribute('visible', 'false')
        footballground.setAttribute('visible', 'true')
        // make timer and hit number visible
        ele.style.visibility = 'visible'
        plate.style.visibility = 'visible'
        score.style.visibility = 'visible'


        // ---------------------------hit variables----------------------------------------
        hit = document.createElement('div')
        hit.style.position = 'absolute'
        hit.style.zIndex = '15'
        hit.style.width = 400
        hit.style.height = 400
        hit.innerHTML = '00'
        hit.style.color = 'white'
        hit.style.fontSize = '40px'
        hit.style.top = '13.3%'
        hit.style.right = '7%'
        document.body.appendChild(hit)
        // ----------------------------------miss variables----------------------------------
        miss = document.createElement('div')
        miss.style.position = 'absolute'
        miss.style.zIndex = '15'
        miss.style.width = 400
        miss.style.height = 400
        miss.innerHTML = '00'
        miss.style.color = 'white'
        miss.style.fontSize = '40px'
        miss.style.top = '2%'
        miss.style.right = '7%'
   
        document.body.appendChild(miss)
        // ---------------------------spawn net-------------------------------------------
        // console.log('isclicked before event', isclicked)
        // The raycaster gives a location of the touch in the scene
        // put net ground andgoal kepper at ray cadst position

        
        const touchPoint = event.detail.intersection.point
         const netpos = new THREE.Vector3(0, -8, -60)
         netpos.sub(touchPoint)
        console.log(netpos)
        netpos.x = 0
        newElement = document.createElement('a-entity')
    

        // ------------------------ goal keeper is spawned in random location in front of goal------

       
        newElement.setAttribute('position', netpos)
        newElement.setAttribute('visible', 'false')
        // intial4 = intial4.add()
        newElement.setAttribute('shadow', {
          receive: false,
        })

        newElement.setAttribute('gltf-model', '#bucket')
        
        newElement.setAttribute('scale', '0.01 0.01 0.01')
        
        newElement.setAttribute('id', 'bucket')
        newElement.setAttribute('body', {
          type: 'static',
          
        })
        
        // isclicked  shows unsafe bt it should be here to work
        this.el.sceneEl.appendChild(newElement)
        newElement.addEventListener('model-loaded', () => {
          // Once the model is loaded, we are ready to show it popping in using an animation
          newElement.setAttribute('visible', 'true')
          isclicked = true
        })
      }
    })
    
  
    // -------------------------------------------------toss----------------------------------------
    const camera = document.getElementById('camera')
    const splatSnd = document.querySelector('#splat').components.sound
    const scoredsnd = document.querySelector('#scoredsound').components.sound
    const touchstart = new THREE.Vector3(0, 0, 0)
    const touchend = new THREE.Vector3(0, 0, 0)
    const direction = new THREE.Vector3(0, 0, 0)

    // --------------------------------touch start------------------------------------------------
    // touch start event to get initial touch pos
    // is clicked is there cauz we want to ignore frst ever tap
    this.el.sceneEl.addEventListener('touchstart', (event) => {
      // console.log(isclicked)
      if (isclicked) {
        secondclick = true
        touchstart.x = event.changedTouches[0].clientX
        touchstart.y = event.changedTouches[0].clientY
        touchstart.z = 0
        // console.log(touchstart)
      }
    }, false)

    // ----------------------------------touch end------------------------------------------------
    // touch end to get last touch position and to calculate direction
    let colideCheck = true
    this.el.sceneEl.addEventListener('touchend', (event) => {
      // console.log(isclicked)
      if (colideCheck === true) {
        if (isclicked) {
         
       

          touchend.x = event.changedTouches[0].clientX
          touchend.y = event.changedTouches[0].clientY
          touchend.z = 0
          colideCheck = false
          const posti = camera.object3D.position
          console.log("campos",posti)
          const minus = new THREE.Vector3(0, -10, 0)
          posti.add(minus)
          console.log(posti.x)
          console.log(posti.y)
          console.log(posti.z)
          console.log(touchend)
          direction.subVectors(touchstart, touchend).normalize()
          // console.log(direction);
          // Create element to be thrown, setting position, scale, and model
          const tomato = document.createElement('a-entity')
          tomato.setAttribute('position', posti)
          tomato.setAttribute('scale', '5 5 5')
          tomato.setAttribute('gltf-model', '#tomatoModel')

          // Choose a random rotation offset for some variation
          
          const randomRotation = {x: -90 + Math.random() * 30, y: Math.random() * 360, z: 0}
          tomato.setAttribute('rotation', randomRotation)

          // Set velocity, rotated with camera direction
          const velocity = new THREE.Vector3(-direction.x, 5.1, -6.5)
          velocity.multiplyScalar(4)
          velocity.applyQuaternion(camera.object3D.quaternion)
          tomato.setAttribute('velocity', velocity)
          // Add physics body
          tomato.setAttribute('body', {
            type: 'dynamic',
            sphereRadius: 0.35,
            shape: 'sphere',
          })

          tomato.setAttribute('shadow', {
            receive: false,
          })

          // Add tomato to scene
          this.el.sceneEl.appendChild(tomato)
          totalthrown++

          // -----------------------------collision----------------------------------------------
          let didCollide = false
          let flag = true;
          tomato.addEventListener('collide', (even) => {
          // when its not ground it is our bowl

            // ------------------------------collide with net----------------------------------------
            if (even.detail.body.el.id === 'bucket') {

               console.log('ballpos', tomato.object3D.position)

               const xposition = tomato.object3D.position.x
                const yposition = tomato.object3D.position.y
              // console.log('bucketpos' , bucket.object3D.position)

            if(yposition>-0.5){

              didCollide = true
              colideCheck = true

              console.log('ballpos', tomato.object3D.position)
              tomato.parentNode.removeChild(tomato)
              hitno++
              flag = false;
              hitcount.innerHTML = `${hitno}`
              // increase hit
              if (hitno < 10) {
                hitno = (`0${hitno}`).slice(-2)
              }
              hit.innerHTML = hitno
              console.log('on goal', totalthrown, '-', missno, hitno)
              plus1.style.display = 'block'
        
              setTimeout(() => {
                plus1.style.display = 'none'
              }, 200)
              splatSnd.stopSound()
              splatSnd.playSound()
            }
            
            } 
            // ------------------------------collide with ground--------------------------------------
            else if (even.detail.body.el.id === 'ground') {
              flag = false;
              didCollide = true
              colideCheck = true
              setTimeout(() => {
                tomato.parentNode.removeChild(tomato)
              }, 3000)
              scoredsnd.stopSound()
              scoredsnd.playSound()
              
              // to calculate missed shots
             
              
               missno = totalthrown - hitno
               miss.innerHTML = `${missno}`
              // increase hit
              if (missno < 10) {
                missno = (`0${missno}`).slice(-2)
              }
              miss.innerHTML = missno
              // console.log('on ground ', missno)
            }

            
          })
        }
      } else {
        colideCheck = true
      }
    })
  },
}

