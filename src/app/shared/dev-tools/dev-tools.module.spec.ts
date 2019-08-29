import {DevToolsModule} from './dev-tools.module';

describe(DevToolsModule.name, () => {
    let devToolsModule: DevToolsModule;

    beforeEach(() => {
        devToolsModule = new DevToolsModule();
    });

    it('should create an instance', () => {
        expect(devToolsModule).toBeTruthy();
    });
});
