import {ShortenUrlPipe} from './shorten-url.pipe';

describe(ShortenUrlPipe.name, () => {
    it('create an instance', () => {
        const pipe = new ShortenUrlPipe();
        expect(pipe).toBeTruthy();
    });
});
