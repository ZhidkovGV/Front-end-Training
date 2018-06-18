import {Observable, Subject, ReplaySubject, from, of, range, fromEvent} from 'rxjs';
import {map, filter, switchMap} from 'rxjs/operators';

const input = document.querySelector('input');
const autoComplete = document.querySelector('.auto-complete');
const autoCompleteItems = Array.from(document.querySelectorAll('.auto-complete-items li'));
const inputChanges = fromEvent(input, 'input');
const complete = fromEvent(autoComplete, 'click');


const requestRepos = (req) => {
    return fetch(`https://api.github.com/search/repositories?q=${req}+in:name&client_id=41af896cd9f20012e512&client_secret=ae08199ed8be428e92e742a8eca4d8d4aeff4e9b`)
        .catch(err => console.log(err))
        .then(res => res.json());
};

const requestUser = (req) => {
    return fetch(`${req}`)
        .catch(err => console.log(err))
        .then(res => res.json());
};

const render = (info) => {
    autoComplete.style.display = "block";
    autoCompleteItems.forEach(async (item, index) => {
        const userInfo = await requestUser(info.items[index].owner.url);
        item.innerText = `${info.items[index].name} -${userInfo.followers || '0'} followers`
    });
};

inputChanges.subscribe(async (event) => {
    const repos = await requestRepos(event.target.value);
    render(repos)
});

complete.subscribe((event) => {
    if (event.target.tagName === "LI") {
        input.value = event.target.innerText.split(' ')[0];
        autoComplete.style.display = "none"
    }
});