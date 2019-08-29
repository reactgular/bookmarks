import {ReactiveOrderPipe} from './reactive-order.pipe';

describe(ReactiveOrderPipe.name, () => {
    it('create an instance', () => {
        const pipe = new ReactiveOrderPipe();
        expect(pipe).toBeTruthy();
    });
});
