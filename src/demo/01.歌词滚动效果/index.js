/**
 * 集中获取dom元素，存放到一个 对象doms 中
 */
const doms = {
  audio: document.querySelector('#audio'),
  container: document.querySelector('.container'),
  ul: document.querySelector('.lrc-list')
}

/**
 * 解析lrc歌词字符串
 * 返回一个歌词对象数组，
 * 每个歌词对象: { time: 开始时间, words: 歌词内容 }
 */
function parseLrc() {
  const arr = lrc.split('\n')
  const result = arr.map(item => {
    if (item.includes('[') && item.includes(']')) {
      const time = item.match(/\[(\d{2}:\d{2}.\d{2})/)[1]
      const words = item.replace(`[${time}]`, '')
      return {
        time: parseTime(time),
        words
      }
    }
  })
  return result
}

/**
 * 将一个时间字符串解析为数字 (秒)
 * @param {string} timeStr 时间字符串，如 '01:23.45'
 * @returns {number} 解析后的数字，如 83.45
 */
function parseTime(timeStr) {
  const [m, s] = timeStr.split(':')
  return +m * 60 + +s
}
const lrcList = parseLrc()
console.log('lrcList :>> ', lrcList)

/**
 * 计算出当播放器播放到第几秒的情况下，
 * 应该显示哪一行歌词的索引,
 * 如果没有一句歌词需要显示，返回 -1
 * @returns {number} 应该显示的行号，从 0 开始
 */
function findIndex() {
  const currentTime = doms.audio.currentTime
  // console.log('currentTime :>> ', currentTime)
  for (let i = 0; i < lrcList.length; i++) {
    if (currentTime < lrcList[i].time) {
      return i - 1
    }
  }

  return lrcList.length - 1
}
// findIndex()

/**
 * 创建显示歌词的元素 li，
 * 并将它们添加到 ul 中，
 * 使用 document.createDocumentFragment() 提高性能
 * @returns {void}
 */
function createLrcElements() {
  const frags = document.createDocumentFragment()

  for (let i = 0; i < lrcList.length; i++) {
    const li = document.createElement('li')
    li.textContent = lrcList[i].words
    frags.append(li)
  }

  // console.log('frags :>> ', frags)
  doms.ul.appendChild(frags)
}
createLrcElements()

const containerHeight = doms.container.clientHeight // 容器的自身高度(不包括边框)
const liHeight = doms.ul.children[0].clientHeight // 每个 li 的高度
const maxOffset = doms.ul.clientHeight - containerHeight
/**
 * 设置 ul 的偏移量，使其与当前播放时间相对应，
 * 使当前播放时间对应的 那个歌词元素li, 出现在容器的最中间
 * @returns {void}
 */
function setOffset() {
  const index = findIndex()
  let offset = liHeight * index + liHeight / 2 - containerHeight / 2
  // 边界判断：没有超出时，offset 为 0，超出时，offset 为 maxOffset
  if (offset < 0) {
    offset = 0
  }
  if (offset > maxOffset) {
    offset = maxOffset
  }
  doms.ul.style.transform = `translateY(-${offset}px)`

  // 去掉之前高亮的li的 active 类名
  const activeLi = doms.ul.querySelector('.active')
  if (activeLi) {
    activeLi.classList.remove('active')
  }

  // 设置当前高亮的li的 active 类名
  const li = doms.ul.children[index]
  if (li) {
    li.classList.add('active')
  }
}
// console.dir(doms.audio)
// setOffset()

// 监听 audio 元素的 timeupdate 事件，并调用 setOffset 方法
doms.audio.addEventListener('timeupdate', setOffset)
