import { Observable, Subject, ReplaySubject, from, of, range,fromEvent } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';

const input = document.querySelector('input');
const autoComplete = document.querySelector('.auto-complete');
const autoCompleteItems = Array.from(document.querySelectorAll('.auto-complete-items li'));
const inputChanges = fromEvent(input,'input');

const render = (info) => {
    autoCompleteItems.forEach((item, index) => {
        item.innerText = info[index].name || ""
    });
};

const requestInfo = (req) => {
    fetch(`https://api.github.com/search/repositories?q=${req}+in:name&client_id=41af896cd9f20012e512&client_secret=ae08199ed8be428e92e742a8eca4d8d4aeff4e9b`)
        .then(res => res.json())
        .then(res => render(res.items))
};

inputChanges.subscribe((event) => {
    const response = requestInfo(event.target.value);
    /*render(response.items)*/

});
