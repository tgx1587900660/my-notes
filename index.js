/**
 * 在文档加载完成后，会调用一些列函数，插入资源到 HTML 文档中
 */
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');
  const urlList = getUrlList();
  const promises = urlList.map(({ url, type }) => {
    if (type === 'script') {
      return new Promise((resolve, reject) => {
        appendScriptToBody(url, false, resolve);
      });
    } else {
      return new Promise((resolve, reject) => {
        appendLinkToHead(url, resolve);
      });
    }
  });

  Promise.all(promises)
    .then((res) => {
      // console.log('res :>> ', res)
      console.log('%c ⭐all resources loaded⭐', 'color: #000; background-color: pink; padding: 6px;border-radius: 4px;');
      console.log('叫你看就看啊');
      createVueApp();
    })
    .catch((err) => {
      console.log('err :>> ', err);
    });
});

/**
 * 用于存储地址的对象数组，
 * 每个对象的格式为：{ url: '', type: 'script' | 'link'}
 */
function getUrlList() {
  return [
    // dayjs
    { url: 'https://unpkg.com/dayjs/dayjs.min.js', type: 'script' },
    { url: 'https://unpkg.com/dayjs/plugin/customParseFormat.js', type: 'script' },
    { url: 'https://unpkg.com/dayjs/plugin/weekday.js', type: 'script' },
    { url: 'https://unpkg.com/dayjs/plugin/localeData.js', type: 'script' },
    { url: 'https://unpkg.com/dayjs/plugin/weekOfYear.js', type: 'script' },
    { url: 'https://unpkg.com/dayjs/plugin/weekYear.js', type: 'script' },
    { url: 'https://unpkg.com/dayjs/plugin/advancedFormat.js', type: 'script' },
    { url: 'https://unpkg.com/dayjs/plugin/quarterOfYear.js', type: 'script' },
    // vue3
    { url: 'https://unpkg.com/vue@3/dist/vue.global.js', type: 'script' },
    // ant-design-vue
    { url: 'https://cdn.jsdelivr.net/npm/ant-design-vue@3.2.20/dist/antd.min.css', type: 'link' },
    { url: 'https://cdn.jsdelivr.net/npm/ant-design-vue@3.2.20/dist/antd.min.js', type: 'script' },
  ];
}

/**
 * 用于创建 script 标签，插入到 body 底部
 */
function appendScriptToBody(src = '', isAsync = false, resolve) {
  const script = document.createElement('script');
  const appScript = document.body.querySelector('#vue-app');
  script.src = src;
  script.async = isAsync;
  script.addEventListener('load', () => {
    resolve(`script --> ok`);
  });
  document.body.insertBefore(script, appScript);
}
/**
 * 用于创建 link 标签，插入到 head 标签 的 title 上方
 */
function appendLinkToHead(href = '', resolve) {
  const title = document.head.querySelector('title');
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.addEventListener('load', () => {
    resolve(`link --> ok`);
  });
  document.head.insertBefore(link, title);
}
