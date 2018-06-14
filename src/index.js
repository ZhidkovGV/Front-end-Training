import { fromEvent } from 'rxjs';

const el = document.body;

// Create an Observable that will publish mouse movements
const mouseMoves = fromEvent(el, 'click');

// Subscribe to start listening for mouse-move events
const subscription = mouseMoves.subscribe((event) => {
    // Log coords of mouse movements
    console.log(`Coords: ${event.clientX} X ${event.clientY}`);

    // When the mouse is over the upper-left of the screen,
    // unsubscribe to stop listening for mouse movements
    if (event.clientX < 40 && event.clientY < 40) {
        subscription.unsubscribe();
    }
});