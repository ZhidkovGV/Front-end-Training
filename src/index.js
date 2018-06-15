import { Observable, Subject, ReplaySubject, from, of, range,fromEvent } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';

const input = document.querySelector('input');
const autoComplete = document.querySelector('.auto-complete');
const autoCompleteItems = Array.from(document.querySelectorAll('.auto-complete-items li'));
const inputChanges = fromEvent(input,'input');
const complete = fromEvent(autoComplete, 'click');

const render = (info) => {
    autoComplete.style.display = "block";
    autoCompleteItems.forEach((item, index) => {
        item.innerText = info[index].name || ""
    });
};

const requestInfo = (req) => {
    return fetch(`https://api.github.com/search/repositories?q=${req}+in:name&client_id=41af896cd9f20012e512&client_secret=ae08199ed8be428e92e742a8eca4d8d4aeff4e9b`)
        .then(res => res.json())
};

inputChanges.subscribe(async(event) => {
    const response = await requestInfo(event.target.value);
    render(response.items)
});

complete.subscribe((event) => {
    console.log(event);
    if(event.target.tagName === "LI") {
        input.value = event.target.innerText;
        autoComplete.style.display = "none"
    }
});