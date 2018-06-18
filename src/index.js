import {from, fromEvent} from 'rxjs';
import {flatMap, debounce} from 'rxjs/operators';
import {timer} from 'rxjs/observable/timer';

const input = document.querySelector('input');
const autoComplete = document.querySelector('.auto-complete');
const notValidated = document.querySelector('.not-validated');
const autoCompleteItems = Array.from(document.querySelectorAll('.auto-complete-items li'));

const inputChanges = fromEvent(input, 'input').pipe(debounce(() => timer(100)));
const completeSearch = fromEvent(autoComplete, 'click');

const render = (info) => {
    autoComplete.style.display = "block";
    autoCompleteItems.forEach((item, index) => {
        const userInfo = from(fetch(info.items[index].owner.url))
            .pipe(
                flatMap(res => from(res.json()))
            )
            .subscribe((res) => {
                item.innerText = `${info.items[index].name} -${res.followers || 'no info about'} followers`
            });
    });
};

inputChanges.subscribe((event) => {
    let isValidated = event.target.value !== '' && !event.target.value.match(/[\s#$%^&@*?]/);
    if (isValidated) {
        notValidated.style.display = "none";
        const repos = from(fetch(`https://api.github.com/search/repositories?q=${event.target.value}+in:name&client_id=41af896cd9f20012e512&client_secret=ae08199ed8be428e92e742a8eca4d8d4aeff4e9b`))
            .pipe(
                flatMap(res => from(res.json()))
            ).subscribe((fetchRes) => {
                render(fetchRes)
            });
    } else {
        autoComplete.style.display = "none";
        notValidated.style.display = "block";
    }
});

completeSearch.subscribe((event) => {
    if (event.target.tagName === "LI") {
        input.value = event.target.innerText.split(' ')[0];
        autoComplete.style.display = "none"
    }
});
















