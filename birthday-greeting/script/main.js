let audioUrl = ""
window.onerror = function(msg, url, lineNo, columnNo, error) {
  console.error('Iframe Error:', msg, 'Line:', lineNo, 'Col:', columnNo, 'Error:', error);
  window.parent.postMessage({ type: 'iframe_error', msg, lineNo }, '*');
};
let audio = null
let isPlaying = false
let hasAnimationStarted = false
let dataArr = []
let pageBackgrounds = {}
let currentSceneKey = ""

const defaultPageBackgrounds = {
  start: "",
  letter: "",
  birthday: "",
  honor: "",
  mvp: "",
  ro: "",
  wish: "",
  final: ""
}

const defaultVisualAssets = {
  portrait: "img/lydia2.png"
}

const chapterSceneMap = {
  start: {
    backgroundKey: "start",
    body: "radial-gradient(circle at top, rgba(92, 72, 170, 0.42), transparent 32%), radial-gradient(circle at 20% 20%, rgba(50, 131, 210, 0.18), transparent 24%), linear-gradient(180deg, #120b25 0%, #090414 54%, #04020b 100%)",
    skyTint: "linear-gradient(180deg, rgba(36, 22, 72, 0.42) 0%, rgba(11, 6, 24, 0.78) 100%), radial-gradient(circle at 50% 18%, rgba(186, 149, 255, 0.18), transparent 24%)",
    overlay: "linear-gradient(180deg, rgba(6, 4, 18, 0.12) 0%, rgba(8, 5, 19, 0.42) 42%, rgba(3, 2, 9, 0.76) 100%), radial-gradient(circle at 50% 36%, rgba(121, 92, 236, 0.12), transparent 32%)",
    vignette: "radial-gradient(circle at center, transparent 38%, rgba(8, 5, 19, 0.26) 62%, rgba(2, 1, 8, 0.8) 100%)",
    orbLeft: "radial-gradient(circle, rgba(104, 181, 255, 0.48) 0%, rgba(104, 181, 255, 0.12) 42%, transparent 72%)",
    orbRight: "radial-gradient(circle, rgba(191, 139, 255, 0.44) 0%, rgba(191, 139, 255, 0.12) 44%, transparent 72%)",
    runeBorder: "rgba(180, 163, 255, 0.14)",
    runeInner: "rgba(197, 185, 255, 0.18)",
    runeAccent: "rgba(102, 192, 255, 0.18)",
    particlesOpacity: 0.72,
    decorOpacity: 0.68
  },
  invitation: {
    backgroundKey: "letter",
    body: "radial-gradient(circle at top, rgba(114, 82, 198, 0.48), transparent 32%), radial-gradient(circle at 18% 18%, rgba(116, 171, 255, 0.2), transparent 24%), linear-gradient(180deg, #150d2f 0%, #0b0619 58%, #04020b 100%)",
    skyTint: "linear-gradient(180deg, rgba(44, 24, 88, 0.34) 0%, rgba(9, 5, 20, 0.72) 100%), radial-gradient(circle at 52% 20%, rgba(244, 210, 138, 0.16), transparent 24%)",
    overlay: "linear-gradient(180deg, rgba(14, 9, 30, 0.12) 0%, rgba(15, 9, 31, 0.4) 38%, rgba(5, 3, 11, 0.78) 100%), radial-gradient(circle at 50% 28%, rgba(247, 208, 132, 0.1), transparent 26%)",
    vignette: "radial-gradient(circle at center, transparent 36%, rgba(16, 9, 34, 0.24) 62%, rgba(4, 2, 10, 0.84) 100%)",
    orbLeft: "radial-gradient(circle, rgba(255, 206, 123, 0.42) 0%, rgba(255, 206, 123, 0.1) 42%, transparent 72%)",
    orbRight: "radial-gradient(circle, rgba(125, 176, 255, 0.42) 0%, rgba(125, 176, 255, 0.1) 44%, transparent 72%)",
    runeBorder: "rgba(255, 214, 149, 0.18)",
    runeInner: "rgba(255, 235, 199, 0.18)",
    runeAccent: "rgba(127, 199, 255, 0.18)",
    particlesOpacity: 0.8,
    decorOpacity: 0.72
  },
  birthdayReveal: {
    backgroundKey: "birthday",
    body: "radial-gradient(circle at top, rgba(132, 92, 255, 0.44), transparent 30%), radial-gradient(circle at 22% 18%, rgba(255, 186, 214, 0.22), transparent 22%), linear-gradient(180deg, #1a1236 0%, #120a24 54%, #06030d 100%)",
    skyTint: "linear-gradient(180deg, rgba(58, 28, 105, 0.26) 0%, rgba(14, 7, 28, 0.62) 100%), radial-gradient(circle at 50% 24%, rgba(255, 224, 168, 0.2), transparent 20%)",
    overlay: "linear-gradient(180deg, rgba(16, 8, 28, 0.08) 0%, rgba(20, 10, 34, 0.34) 36%, rgba(5, 3, 12, 0.72) 100%), radial-gradient(circle at 50% 34%, rgba(255, 213, 131, 0.16), transparent 30%)",
    vignette: "radial-gradient(circle at center, transparent 42%, rgba(18, 8, 33, 0.18) 66%, rgba(4, 2, 10, 0.8) 100%)",
    orbLeft: "radial-gradient(circle, rgba(255, 189, 129, 0.44) 0%, rgba(255, 189, 129, 0.12) 42%, transparent 72%)",
    orbRight: "radial-gradient(circle, rgba(255, 132, 210, 0.38) 0%, rgba(255, 132, 210, 0.1) 44%, transparent 72%)",
    runeBorder: "rgba(255, 205, 138, 0.18)",
    runeInner: "rgba(255, 235, 206, 0.2)",
    runeAccent: "rgba(255, 163, 226, 0.16)",
    particlesOpacity: 0.88,
    decorOpacity: 0.74
  },
  honorStage: {
    backgroundKey: "honor",
    body: "radial-gradient(circle at top, rgba(255, 191, 97, 0.26), transparent 28%), radial-gradient(circle at 24% 18%, rgba(255, 120, 102, 0.14), transparent 22%), linear-gradient(180deg, #231125 0%, #140814 56%, #080308 100%)",
    skyTint: "linear-gradient(180deg, rgba(122, 43, 59, 0.22) 0%, rgba(30, 9, 17, 0.68) 100%), radial-gradient(circle at 50% 18%, rgba(255, 216, 136, 0.18), transparent 24%)",
    overlay: "linear-gradient(180deg, rgba(28, 11, 17, 0.08) 0%, rgba(36, 12, 18, 0.3) 38%, rgba(10, 4, 6, 0.76) 100%), radial-gradient(circle at 50% 32%, rgba(255, 198, 99, 0.2), transparent 28%)",
    vignette: "radial-gradient(circle at center, transparent 42%, rgba(24, 8, 10, 0.18) 64%, rgba(7, 2, 4, 0.84) 100%)",
    orbLeft: "radial-gradient(circle, rgba(255, 204, 112, 0.42) 0%, rgba(255, 204, 112, 0.1) 42%, transparent 72%)",
    orbRight: "radial-gradient(circle, rgba(255, 104, 104, 0.34) 0%, rgba(255, 104, 104, 0.08) 44%, transparent 72%)",
    runeBorder: "rgba(255, 212, 142, 0.2)",
    runeInner: "rgba(255, 233, 192, 0.2)",
    runeAccent: "rgba(255, 133, 120, 0.16)",
    particlesOpacity: 0.92,
    decorOpacity: 0.8
  },
  mvpCelebration: {
    backgroundKey: "mvp",
    body: "radial-gradient(circle at top, rgba(255, 208, 101, 0.3), transparent 28%), radial-gradient(circle at 22% 18%, rgba(255, 120, 145, 0.16), transparent 22%), linear-gradient(180deg, #2b1830 0%, #190d1b 56%, #090408 100%)",
    skyTint: "linear-gradient(180deg, rgba(134, 63, 94, 0.18) 0%, rgba(29, 11, 17, 0.66) 100%), radial-gradient(circle at 50% 22%, rgba(255, 228, 144, 0.24), transparent 18%)",
    overlay: "linear-gradient(180deg, rgba(30, 13, 21, 0.06) 0%, rgba(44, 16, 27, 0.26) 38%, rgba(9, 4, 7, 0.74) 100%), radial-gradient(circle at 50% 32%, rgba(255, 218, 112, 0.24), transparent 26%)",
    vignette: "radial-gradient(circle at center, transparent 44%, rgba(28, 12, 16, 0.14) 68%, rgba(8, 3, 5, 0.84) 100%)",
    orbLeft: "radial-gradient(circle, rgba(255, 216, 122, 0.46) 0%, rgba(255, 216, 122, 0.12) 42%, transparent 72%)",
    orbRight: "radial-gradient(circle, rgba(255, 166, 195, 0.36) 0%, rgba(255, 166, 195, 0.1) 44%, transparent 72%)",
    runeBorder: "rgba(255, 225, 158, 0.22)",
    runeInner: "rgba(255, 244, 204, 0.22)",
    runeAccent: "rgba(255, 164, 207, 0.16)",
    particlesOpacity: 1,
    decorOpacity: 0.84
  },
  dreamTown: {
    backgroundKey: "ro",
    body: "radial-gradient(circle at top, rgba(124, 150, 255, 0.34), transparent 30%), radial-gradient(circle at 20% 18%, rgba(255, 182, 217, 0.2), transparent 24%), linear-gradient(180deg, #161a3d 0%, #101129 56%, #05060e 100%)",
    skyTint: "linear-gradient(180deg, rgba(72, 86, 170, 0.16) 0%, rgba(17, 18, 43, 0.62) 100%), radial-gradient(circle at 50% 22%, rgba(255, 214, 224, 0.16), transparent 24%)",
    overlay: "linear-gradient(180deg, rgba(12, 13, 32, 0.06) 0%, rgba(16, 17, 41, 0.24) 36%, rgba(6, 7, 14, 0.7) 100%), radial-gradient(circle at 50% 32%, rgba(179, 205, 255, 0.12), transparent 28%)",
    vignette: "radial-gradient(circle at center, transparent 42%, rgba(12, 13, 32, 0.16) 66%, rgba(4, 5, 11, 0.8) 100%)",
    orbLeft: "radial-gradient(circle, rgba(152, 202, 255, 0.42) 0%, rgba(152, 202, 255, 0.12) 42%, transparent 72%)",
    orbRight: "radial-gradient(circle, rgba(255, 198, 226, 0.34) 0%, rgba(255, 198, 226, 0.1) 44%, transparent 72%)",
    runeBorder: "rgba(170, 203, 255, 0.16)",
    runeInner: "rgba(225, 236, 255, 0.18)",
    runeAccent: "rgba(255, 204, 227, 0.16)",
    particlesOpacity: 0.84,
    decorOpacity: 0.72
  },
  birthdayWish: {
    backgroundKey: "wish",
    body: "radial-gradient(circle at top, rgba(255, 182, 205, 0.24), transparent 30%), radial-gradient(circle at 18% 18%, rgba(177, 162, 255, 0.24), transparent 24%), linear-gradient(180deg, #2a1736 0%, #170c1e 58%, #070309 100%)",
    skyTint: "linear-gradient(180deg, rgba(133, 77, 144, 0.16) 0%, rgba(28, 15, 35, 0.62) 100%), radial-gradient(circle at 50% 22%, rgba(255, 235, 188, 0.16), transparent 22%)",
    overlay: "linear-gradient(180deg, rgba(24, 11, 26, 0.06) 0%, rgba(30, 16, 32, 0.24) 36%, rgba(8, 4, 10, 0.72) 100%), radial-gradient(circle at 50% 34%, rgba(255, 213, 182, 0.14), transparent 30%)",
    vignette: "radial-gradient(circle at center, transparent 44%, rgba(25, 12, 28, 0.14) 68%, rgba(7, 3, 8, 0.82) 100%)",
    orbLeft: "radial-gradient(circle, rgba(255, 202, 214, 0.38) 0%, rgba(255, 202, 214, 0.1) 42%, transparent 72%)",
    orbRight: "radial-gradient(circle, rgba(184, 170, 255, 0.36) 0%, rgba(184, 170, 255, 0.1) 44%, transparent 72%)",
    runeBorder: "rgba(255, 218, 205, 0.18)",
    runeInner: "rgba(255, 240, 230, 0.18)",
    runeAccent: "rgba(190, 182, 255, 0.16)",
    particlesOpacity: 0.9,
    decorOpacity: 0.76
  },
  finale: {
    backgroundKey: "final",
    body: "radial-gradient(circle at top, rgba(255, 205, 120, 0.24), transparent 28%), radial-gradient(circle at 22% 18%, rgba(255, 126, 190, 0.18), transparent 22%), linear-gradient(180deg, #1b1435 0%, #110a20 56%, #05030b 100%)",
    skyTint: "linear-gradient(180deg, rgba(84, 58, 156, 0.18) 0%, rgba(14, 10, 28, 0.64) 100%), radial-gradient(circle at 50% 20%, rgba(255, 222, 132, 0.18), transparent 24%)",
    overlay: "linear-gradient(180deg, rgba(12, 9, 28, 0.06) 0%, rgba(16, 11, 33, 0.22) 36%, rgba(6, 4, 14, 0.7) 100%), radial-gradient(circle at 50% 30%, rgba(255, 204, 114, 0.16), transparent 28%)",
    vignette: "radial-gradient(circle at center, transparent 46%, rgba(14, 9, 29, 0.12) 68%, rgba(4, 2, 10, 0.8) 100%)",
    orbLeft: "radial-gradient(circle, rgba(255, 205, 122, 0.44) 0%, rgba(255, 205, 122, 0.12) 42%, transparent 72%)",
    orbRight: "radial-gradient(circle, rgba(255, 141, 214, 0.34) 0%, rgba(255, 141, 214, 0.1) 44%, transparent 72%)",
    runeBorder: "rgba(255, 219, 152, 0.18)",
    runeInner: "rgba(255, 238, 198, 0.18)",
    runeAccent: "rgba(255, 169, 222, 0.16)",
    particlesOpacity: 1,
    decorOpacity: 0.82
  }
}

const getSceneElements = () => ({
  sky: document.querySelector(".scene-backdrop__sky"),
  overlay: document.querySelector(".scene-backdrop__overlay"),
  vignette: document.querySelector(".scene-backdrop__vignette"),
  particles: document.querySelector(".scene-backdrop__particles"),
  decor: document.querySelector(".scene-backdrop__decor"),
  runeNodes: document.querySelectorAll(".scene-backdrop__rune"),
  leftOrb: document.querySelector(".scene-backdrop__orb--left"),
  rightOrb: document.querySelector(".scene-backdrop__orb--right")
})

const bindImageFallback = (img, options = {}) => {
  if (!img || img.dataset.fallbackBound === "true") {
    return
  }

  const fallbackSrc = options.fallbackSrc || ""
  const hideOnError = options.hideOnError !== false

  const handleError = () => {
    const currentSrc = img.getAttribute("src") || ""

    if (fallbackSrc && currentSrc !== fallbackSrc && img.dataset.fallbackApplied !== "true") {
      img.dataset.fallbackApplied = "true"
      img.setAttribute("src", fallbackSrc)
      return
    }

    if (hideOnError) {
      img.style.display = "none"
    }
  }

  img.dataset.fallbackBound = "true"
  img.addEventListener("error", handleError)

  if (img.complete && img.naturalWidth === 0) {
    handleError()
  }
}

const initializeAssetFallbacks = () => {
  bindImageFallback(document.querySelector(".lydia-dp"), {
    fallbackSrc: defaultVisualAssets.portrait,
    hideOnError: true
  })

  document.querySelectorAll(".hat").forEach(img => {
    bindImageFallback(img, {
      hideOnError: true
    })
  })
}

const applySceneStyles = scene => {
  const sceneEls = getSceneElements()
  const bgUrl = pageBackgrounds[scene.backgroundKey]

  document.body.style.background = scene.body

  if (sceneEls.sky) {
    sceneEls.sky.style.backgroundImage = bgUrl
      ? `${scene.skyTint}, url("${bgUrl}")`
      : scene.skyTint
    sceneEls.sky.style.backgroundPosition = bgUrl ? "center, center" : "center"
    sceneEls.sky.style.backgroundSize = bgUrl ? "cover, cover" : "cover"
    sceneEls.sky.style.backgroundRepeat = bgUrl ? "no-repeat, no-repeat" : "no-repeat"
  }

  if (sceneEls.overlay) {
    sceneEls.overlay.style.background = scene.overlay
  }

  if (sceneEls.vignette) {
    sceneEls.vignette.style.background = scene.vignette
  }

  if (sceneEls.leftOrb) {
    sceneEls.leftOrb.style.background = scene.orbLeft
  }

  if (sceneEls.rightOrb) {
    sceneEls.rightOrb.style.background = scene.orbRight
  }

  if (sceneEls.particles) {
    sceneEls.particles.style.opacity = scene.particlesOpacity
  }

  if (sceneEls.decor) {
    sceneEls.decor.style.opacity = scene.decorOpacity
  }

  sceneEls.runeNodes.forEach(node => {
    node.style.borderColor = scene.runeBorder
    node.style.boxShadow = `inset 0 0 40px ${scene.runeBorder}, 0 0 40px ${scene.runeAccent}`
    node.style.setProperty("--scene-rune-inner", scene.runeInner)
    node.style.setProperty("--scene-rune-accent", scene.runeAccent)
  })
}

const setSceneBg = (sceneKey, options = {}) => {
  const scene = chapterSceneMap[sceneKey]
  const sceneEls = getSceneElements()

  if (!scene || !sceneEls.sky || (!options.force && currentSceneKey === sceneKey)) {
    return
  }

  const duration = typeof options.duration === "number" ? options.duration : 0.75
  currentSceneKey = sceneKey

  if (options.immediate) {
    applySceneStyles(scene)
    return
  }

  TweenMax.killTweensOf([
    document.body,
    sceneEls.sky,
    sceneEls.overlay,
    sceneEls.vignette,
    sceneEls.particles,
    sceneEls.decor,
    sceneEls.leftOrb,
    sceneEls.rightOrb
  ])

  TweenMax.to(
    [
      sceneEls.sky,
      sceneEls.overlay,
      sceneEls.vignette,
      sceneEls.particles,
      sceneEls.decor
    ],
    duration * 0.5,
    {
      opacity: 0.45,
      ease: Power1.easeIn,
      onComplete: () => {
        applySceneStyles(scene)
        TweenMax.to(
          [
            sceneEls.sky,
            sceneEls.overlay,
            sceneEls.vignette,
            sceneEls.particles,
            sceneEls.decor
          ],
          duration,
          {
            opacity: 1,
            ease: Power1.easeOut
          }
        )
      }
    }
  )
}

const finishGreetingSetup = () => {
  if (!Object.keys(pageBackgrounds).length) {
    pageBackgrounds = { ...defaultPageBackgrounds }
  }

  initializeAssetFallbacks()
  setSceneBg("start", {
    immediate: true,
    force: true
  })

  // Tell parent we are ready to start
  window.parent.postMessage('greeting_ready', '*');

  document.querySelector("#startButton").addEventListener("click", () => {
    document.querySelector(".startSign").style.display = "none"
    startAnimation()
  })
}

// Import the data to customize and insert them into page
const fetchData = () => {
  fetch("customize.json?v=" + new Date().getTime())
    .then(data => data.json())
    .then(data => {
      dataArr = Object.keys(data)
      dataArr.forEach(customData => {
        if (data[customData] !== "") {
          if (customData === "imagePath") {
            document
              .querySelectorAll(`[data-node-name*="${customData}"]`)
              .forEach(imgEl => imgEl.setAttribute("src", data[customData]))
          } else if (customData === "fonts") {
            data[customData].forEach(font => {
              const link = document.createElement('link')
              link.rel = 'stylesheet'
              link.href = font.path
              document.head.appendChild(link)
              //设置body字体
              document.body.style.fontFamily = font.name
            })
          } else if (customData === "music") {
            const urlParams = new URLSearchParams(window.location.search)
            const queryMusic = urlParams.get('music')
            audioUrl = queryMusic ? queryMusic : data[customData]
            audio = new Audio(audioUrl)
            audio.preload = "auto"
          } else if (customData === "pageBackgrounds") {
            pageBackgrounds = {
              ...defaultPageBackgrounds,
              ...data[customData]
            }
          } else {
            const textEl = document.querySelector(`[data-node-name*="${customData}"]`);
            if(textEl) textEl.textContent = data[customData];
          }
        }

        // Check if the iteration is over
        // Run amimation if so
        if (dataArr.length === dataArr.indexOf(customData) + 1) {
          finishGreetingSetup()
        }
      })

      if (!dataArr.length) {
        finishGreetingSetup()
      }
    })
    .catch(error => {
      console.error("Failed to load customize.json", error)
      finishGreetingSetup()
    })
}

// Animation Timeline
const animationTimeline = () => {
  // Spit chars that needs to be animated individually
  const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0]
  const hbd = document.getElementsByClassName("wish-hbd")[0]

  textBoxChars.innerHTML = `<span>${textBoxChars.textContent
    .split("")
    .join("</span><span>")}</span>`

  hbd.innerHTML = `<span>${hbd.textContent
    .split("")
    .join("</span><span>")}</span>`

  const ideaTextTrans = {
    opacity: 0,
    y: -20,
    rotationX: 5,
    skewX: "15deg"
  }

  const ideaTextTransLeave = {
    opacity: 0,
    y: 20,
    rotationY: 5,
    skewX: "-15deg"
  }

  const tl = new TimelineMax()

  // 重温前需要把上一轮时间轴留下的 inline style 清回初始态，
  // 否则深色卡片容器会在首帧短暂露出成黑框。
  const resetReplayState = () => {
    TweenMax.set(".four", { display: "none" })
    TweenMax.set(".four .text-box", {
      clearProps: "transform,x,y,scale,opacity,visibility"
    })
    TweenMax.set(".hbd-chatbox span", {
      clearProps: "all",
      visibility: "hidden"
    })

    TweenMax.set(".five p, .idea-3 strong, .idea-6 span", {
      clearProps: "all"
    })

    TweenMax.set(".six", {
      clearProps: "transform,zIndex",
      autoAlpha: 0,
      y: 0
    })
    TweenMax.set(".wish, .wish-hbd span, .wish h5, .lydia-dp, .hat", {
      clearProps: "all"
    })

    TweenMax.set(".scene-props img", {
      clearProps: "transform,x,y,scale,rotation",
      opacity: 0
    })
  }

  resetReplayState()

  // 隐藏所有道具的辅助方法，用于场景切换
  const hideAllProps = () => {
    TweenMax.to(".scene-props img", 0.5, { opacity: 0 });
  }

  tl
    .to(".container", 0.1, {
      visibility: "visible"
    })
    .call(() => {
      setSceneBg("invitation");
      hideAllProps();
      // 飞入魔法信件
      TweenMax.fromTo("#prop-letter", 1.5,
        { y: -50, scale: 0.8, opacity: 0, rotation: -10 }, 
        { y: 0, scale: 1, opacity: 1, rotation: 0, ease: Back.easeOut.config(1.7) }
      );
    })
    .from(".one", 0.7, {
      opacity: 0,
      y: 10
    })
    .from(".two", 0.4, {
      opacity: 0,
      y: 10
    })
    .to(
      ".one",
      0.7,
      {
        opacity: 0,
        y: 10
      },
      "+=2.5"
    )
    .to(
      ".two",
      0.7,
      {
        opacity: 0,
        y: 10
      },
      "-=1"
    )
    .call(() => {
      setSceneBg("birthdayReveal");
      hideAllProps();
    })
    .from(".three", 0.7, {
      opacity: 0,
      y: 10
      // scale: 0.7
    })
    .to(
      ".three",
      0.7,
      {
        opacity: 0,
        y: 10
      },
      "+=2"
    )
    .set(".four", {
      display: "block"
    })
    .fromTo(".four .text-box", 0.7, {
      scale: 0.2,
      autoAlpha: 0
    }, {
      scale: 1,
      autoAlpha: 1
    })
    .from(".fake-btn", 0.3, {
      scale: 0.2,
      opacity: 0
    })
    .staggerTo(
      ".hbd-chatbox span",
      0.5,
      {
        visibility: "visible"
      },
      0.05
    )
    .to(".fake-btn", 0.1, {
      backgroundColor: "#8FE3B6"
    })
    .to(
      ".four .text-box",
      0.5,
      {
        scale: 0.2,
        autoAlpha: 0,
        y: -150
      },
      "+=0.7"
    )
    .set(".four", {
      display: "none"
    })
    .from(".idea-1", 0.7, ideaTextTrans)
    .to(".idea-1", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-2", 0.7, ideaTextTrans)
    .to(".idea-2", 0.7, ideaTextTransLeave, "+=1.5")
    .call(() => {
      setSceneBg("honorStage");
      hideAllProps();
      // 砸下荣耀徽章
      TweenMax.fromTo("#prop-badge", 1,
        { scale: 3, opacity: 0, y: -100 }, 
        { scale: 1, opacity: 1, y: 0, ease: Bounce.easeOut }
      );
    })
    .from(".idea-3", 0.7, ideaTextTrans)
    .to(".idea-3 strong", 0.5, {
      scale: 1.06,
      x: 0,
      backgroundColor: "rgb(255, 240, 210)",
      color: "#7c4d16"
    })
    .to(".idea-3", 0.7, ideaTextTransLeave, "+=1.5")
    .from(".idea-4", 0.7, ideaTextTrans)
    .to(".idea-4", 0.7, ideaTextTransLeave, "+=1.5")
    .from(
      ".idea-5",
      0.7,
      {
        rotationX: 15,
        rotationZ: -10,
        skewY: "-5deg",
        y: 50,
        z: 10,
        opacity: 0
      },
      "+=0.5"
    )
    .to(
      ".idea-5 .smiley",
      0.7,
      {
        rotation: 90,
        x: 8
      },
      "+=0.4"
    )
    .to(
      ".idea-5",
      0.7,
      {
        scale: 0.2,
        opacity: 0
      },
      "+=2"
    )
    .call(() => {
      setSceneBg("mvpCelebration");
      hideAllProps();
      // 弹出礼物盒
      TweenMax.fromTo("#prop-gift", 0.8,
        { scale: 0.2, opacity: 0, y: 50 }, 
        { scale: 1, opacity: 1, y: 0, ease: Back.easeOut.config(1.5) }
      );
    })
    .staggerFrom(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: 15,
        ease: Expo.easeOut
      },
      0.2
    )
    .staggerTo(
      ".idea-6 span",
      0.8,
      {
        scale: 3,
        opacity: 0,
        rotation: -15,
        ease: Expo.easeOut
      },
      0.2,
      "+=1"
    )
    .call(() => {
      setSceneBg("dreamTown");
      hideAllProps();
      // RO小镇：气球和小精灵飘入
      TweenMax.fromTo("#prop-balloon-a", 4, { y: 200, opacity: 0 }, { y: 0, opacity: 1, ease: Power1.easeOut });
      TweenMax.fromTo("#prop-balloon-b", 5, { y: 250, opacity: 0 }, { y: 0, opacity: 1, ease: Power1.easeOut, delay: 0.5 });
      TweenMax.fromTo("#prop-sprite", 3, { x: 100, opacity: 0 }, { x: 0, opacity: 1, ease: Sine.easeOut, delay: 1 });
    })
    .to({}, 8.9, {})
    .call(() => {
      setSceneBg("birthdayWish");
      hideAllProps();
      TweenMax.set(".six", { autoAlpha: 1 }); // 显示六号场景
      // 正式祝福：保留原项目人物与帽子的相对关系，只把人物放回 .six 层统一退场
      TweenMax.fromTo(".lydia-dp", 1.5, { y: "100%", opacity: 0 }, { y: 0, opacity: 1, ease: Power3.easeOut });
      TweenMax.fromTo("#prop-cake", 1, { scale: 0.5, opacity: 0, rotation: 10 }, { scale: 1, opacity: 1, rotation: 0, delay: 0.8, ease: Back.easeOut.config(1.5) });
    })
    .fromTo(
      ".hat",
      0.65,
      {
        x: -150,
        y: 280,
        rotation: -170,
        opacity: 0
      },
      {
        x: 0,
        y: 0,
        rotation: -10,
        opacity: 1,
        ease: Back.easeOut.config(1.4)
      },
      "-=0.95"
    )
    .staggerFrom(
      ".wish-hbd span",
      0.7,
      {
        opacity: 0,
        y: -50,
        // scale: 0.3,
        rotation: 150,
        skewX: "30deg",
        ease: Elastic.easeOut.config(1, 0.5)
      },
      0.1
    )
    .staggerFromTo(
      ".wish-hbd span",
      0.7,
      {
        scale: 1.4,
        rotationY: 150
      },
      {
        scale: 1,
        rotationY: 0,
        color: "#ff69b4",
        ease: Expo.easeOut
      },
      0.1,
      "party"
    )
    .from(
      ".wish h5",
      0.5,
      {
        opacity: 0,
        y: 10,
        skewX: "-15deg"
      },
      "party"
    )
    .to({}, 2.4, {})
    .call(() => {
      setSceneBg("finale");
      hideAllProps();
    })
    .staggerTo(
      ".eight svg",
      1.5,
      {
        visibility: "visible",
        opacity: 0,
        scale: 80,
        repeat: 3,
        repeatDelay: 1.4
      },
      0.3
    )
    .to(".six", 0.5, {
      opacity: 0,
      y: 30,
      zIndex: "-1"
    })
    .staggerFrom(".nine p", 1, ideaTextTrans, 1.2)
    .to(
      ".last-smile",
      0.5,
      {
        rotation: 90
      },
      "+=1"
    )

  // tl.seek("currentStep");
  // tl.timeScale(2);

  // 通知父组件动画结束
  tl.call(() => {
    window.parent.postMessage('birthday_animation_end', '*');
  });

  // Restart Animation on click
  const replyBtn = document.getElementById("replay")
  replyBtn.addEventListener("click", () => {
    resetReplayState()
    setSceneBg("start", {
      immediate: true,
      force: true
    })
    tl.restart()

  })
}

// Run fetch and animation in sequence
fetchData()

const playPauseButton = document.getElementById('playPauseButton')

document.getElementById('startButton').addEventListener('click', () => {
  startAnimation()
})

playPauseButton.addEventListener('click', () => {
  if (audio) {
    togglePlay(!isPlaying)
  }
})

function togglePlay(play) {
  if (!audio) return

  isPlaying = play
  if (play) {
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.warn("Audio autoplay was prevented or failed to load:", error);
      });
    }
  } else {
    audio.pause();
  }
  playPauseButton.classList.toggle('playing', play)
}

function startAnimation() {
  if (hasAnimationStarted) {
    return
  }

  hasAnimationStarted = true
  if (audio) {
    togglePlay(true)
  }
  try {
    animationTimeline()
  } catch (e) {
    console.error(e);
    alert('Animation error: ' + e.message);
  }
}

// 监听父组件发来的切换音乐消息
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'change_music') {
    const newMusicUrl = event.data.url;
    const wasPlaying = isPlaying;
    
    if (audio) {
      audio.pause();
    }
    
    audio = new Audio(newMusicUrl);
    audio.loop = true;
    audio.preload = "auto";
    
    if (wasPlaying) {
      audio.play().then(() => {
        playPauseButton.classList.add('playing');
      }).catch(console.error);
    } else {
      playPauseButton.classList.remove('playing');
    }
  } else if (event.data && event.data.type === 'start_animation') {
    // 收到 Vue 父组件的启动信号（幂等处理，避免多次触发）
    startAnimation();
  }
});
