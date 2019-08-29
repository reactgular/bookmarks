import {LayoutsModule} from './layouts.module';

describe(LayoutsModule.name, () => {
    let layoutsModule: LayoutsModule;

    beforeEach(() => {
        layoutsModule = new LayoutsModule();
    });

    it('should create an instance', () => {
        expect(layoutsModule).toBeTruthy();
    });
});
