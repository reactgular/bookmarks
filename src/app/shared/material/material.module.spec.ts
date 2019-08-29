import {MaterialModule} from './material.module';

describe(MaterialModule.name, () => {
    let materialModule: MaterialModule;

    beforeEach(() => {
        materialModule = new MaterialModule();
    });

    it('should create an instance', () => {
        expect(materialModule).toBeTruthy();
    });
});
