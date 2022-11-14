const cssPromises = {};

function loadResourse(src) {
    // JS module
    if (src.endsWith('.js')) {
        return import(src);
    }
    // CSS файл
    if (src.endsWith('.css')) {
        if (!cssPromises[src]) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = src;
            cssPromises[src] = new Promise(resolve => {
                link.addEventListener('load', () => {
                    resolve()
                });
            });
            document.head.append(link)
        }
        return cssPromises[src]
    }
    //Данные сервера
    return fetch(src).then(res => res.json()).then((data) => { return data });
}

const appContainer = document.querySelector('.container');

let counter = 0
window.addEventListener('hashchange', () => {
    const newsId = location.hash.slice(1);
    if (newsId) {
        counter++
        renderPage(
            './detail-page.js',
            `https://hacker-news.firebaseio.com/v0/item/${newsId}.json`,
            'https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css',
            'style/style.css',
        )
    } else {
        counter = 0
        renderPage(
            './home-page.js',
            'https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty',
            'https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css',
            'style/style.css',
        )
    }
});

function renderPage(moduleName, apiUrl, cssBootstrap, css) {
    Promise.all([moduleName, apiUrl, cssBootstrap, css].map(src => loadResourse(src)))
        .then(([pageModule, data]) => {
            appContainer.innerHTML = '';
            document.querySelector('.spinner-border').style.display = 'block';
            appContainer.append(pageModule.render(data));
        });
}

if (counter === 0) {
    renderPage(
        './home-page.js',
        'https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty',
        'https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css',
        'style/style.css',
    )
}
