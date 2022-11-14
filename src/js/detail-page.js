export function render(data) {
    let oneStoryURL = 'https://hacker-news.firebaseio.com/v0/item/';

    const btnBack = document.createElement('a');
    const title = document.createElement('h2');
    const link = document.createElement('a');
    const date = document.createElement('p');
    const author = document.createElement('p');
    const commentNumb = document.createElement('p');
    const commentList = document.createElement('ol');

    btnBack.classList.add('btn', 'btn-primary');
    btnBack.setAttribute('href', 'javascript:history.back()');
    btnBack.textContent = 'Вернуться к новостям';

    title.textContent = data.title;
    link.textContent = data.url;
    link.setAttribute('href', `${data.url}`);
    let dateCorrect = new Date(parseInt(data.time) * 1000);
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
    let dateRu = dateCorrect.toLocaleString("ru", options);
    author.textContent = `Автор: ${data.by}`
    date.textContent = `Дата публикации: ${dateRu}`;
    commentNumb.textContent = `Количество комментариев: ${data.descendants}`;

    document.querySelector('.container').append(btnBack, title, link, date, author, commentNumb);

    if (data.descendants > 0) {
        const commentAll = document.createElement('button');
        commentAll.textContent = 'Показать все комментарии';
        commentAll.classList.add('btn', 'btn-dark');
        document.querySelector('.container').append(commentAll);

        commentAll.addEventListener('click', async () => {
            data.kids.forEach(async (item) => {
                let resolve = await fetch(`${oneStoryURL}${item}.json`)
                let dataComment = await resolve.json();
                
                let commentLi = document.createElement('li');
                commentLi.classList.add('li-js')
                commentLi.innerHTML = `${dataComment.by}: ${dataComment.text}`
    
                //если элемент содержит вложенные коментарии, то запрашиваем их
                let ListNew = document.createElement('ul')
                if (dataComment.hasOwnProperty('kids')) {
                    let btnMore = document.createElement('button')
                    btnMore.classList.add('btn', 'btn-dark')
                    btnMore.innerHTML = 'ещё'
                    commentLi.append(btnMore);
    
                    //По клику на кнопку выводим все вложенные комменты 
                    let counter = 0;
                    btnMore.addEventListener('click', () => {
                        dataComment.kids.forEach(async (item) => {
                            if(counter>0) {return};
                            
                            counter++
                            let resolve = await fetch(`${oneStoryURL}${item}.json`);
                            let dataCommentNew = await resolve.json();
                            let commentLiNew = document.createElement('li');
                            commentLiNew.classList.add('li-new-js');
                            commentLiNew.innerHTML = `${dataCommentNew.by}: ${dataCommentNew.text}`;
                            ListNew.append(commentLiNew);
    
                        })
                        commentLi.append(ListNew)
                    })
                }
                commentList.append(commentLi)
    
            });
            document.querySelector('.container').append(commentList);
        });
    }

    // по клику на кнопку показываем все корневые комментарии
    document.querySelector('.spinner-border').style.display = 'none';
}