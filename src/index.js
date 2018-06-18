import {Observable, Subject, ReplaySubject, from, of, fromEvent} from 'rxjs';
import {map, filter, switchMap, flatMap, debounce, bufferCount, catchError} from 'rxjs/operators';
import {timer} from 'rxjs/observable/timer';

const input = document.querySelector('input');
const autoComplete = document.querySelector('.auto-complete');

const autoCompleteItems = Array.from(document.querySelectorAll('.auto-complete-items li'));

const inputChanges = fromEvent(input, 'input').pipe(debounce(() => timer(200)));
const completeSearch = fromEvent(autoComplete, 'click');

const render = (info) => {
    autoComplete.style.display = "block";
    autoCompleteItems.forEach((item, index) => {
        const userInfo =  from(fetch(info.items[index].owner.url))
            .pipe(flatMap(res => from(res.json())))
            .subscribe((res) => {
                item.innerText = `${info.items[index].name} -${res.followers || '0'} followers`
            });
    });
};

inputChanges.subscribe((event) => {
    const repos = from(fetch(`https://api.github.com/search/repositories?q=${event.target.value}+in:name&client_id=41af896cd9f20012e512&client_secret=ae08199ed8be428e92e742a8eca4d8d4aeff4e9b`))
        .pipe(
            flatMap(res => from(res.json()))
        ).subscribe((fetchRes) => {
            render(fetchRes)
        });
});

completeSearch.subscribe((event) => {
    if (event.target.tagName === "LI") {
        input.value = event.target.innerText.split(' ')[0];
        autoComplete.style.display = "none"
    }
});
















