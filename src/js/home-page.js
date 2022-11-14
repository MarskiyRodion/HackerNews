export function render(data) {

    // Функция перезагрузки страницы
    function reload() {
        window.location.reload();
        history.pushState('', document.title, window.location.pathname);
    };

    let allNewsArr = [];
    let list = document.createElement('ul')
    Promise.all(data.map(async (id) => {
        let responseNews = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        let dataNews = await responseNews.json()
        allNewsArr.push(dataNews)
    })).then(() => {
        allNewsArr.sort(function (a, b) {
            return parseInt(b.time) - parseInt(a.time);
        });
        let count = 0;
        allNewsArr.forEach(item => {
            if (count === 100) {
                return;
            }
            count++
            list.append(createNews(item));
        });
        // Перезагрузка страницы раз в минуту
        // let reloadInterval = setTimeout(() => {
        //     reload();
        //     if(document.querySelector('.btn-dark')) {
        //         clearInterval(reloadInterval)
        //     }
        // }, 60000);
        document.querySelector('.spinner-border').style.display = 'none';
    })
    function createNews(item) {
        const li = document.createElement('li');
        const link = document.createElement('a');
        const rating = document.createElement('p');
        const author = document.createElement('p');
        const date = document.createElement('p');

        let dateCorrect = new Date(parseInt(item.time) * 1000);
        let options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            timezone: 'UTC',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        let dateRu = dateCorrect.toLocaleString("ru", options)

        li.classList.add('list__item');
        link.classList.add('list__link');
        link.setAttribute('href', `${item.id}`)
        link.addEventListener('click', (e) => {
            e.preventDefault()
            let id = link.getAttribute("href");
            window.location.hash = id;
            clearInterval(reload);
        })
        rating.classList.add('list__descr', 'list__rating');
        author.classList.add('list__descr', 'list__author');
        date.classList.add('list__descr', 'list__date');

        link.textContent = item.title;
        rating.textContent = `Количество комментариев: ${item.descendants}`;
        author.textContent = `Автор: ${item.by}`;
        date.textContent = `Дата публикации: ${dateRu}`
        li.append(link, rating, author, date);
        return li
    }
    return list;
}