import {NetworksModule} from './networks.module';

describe(NetworksModule.name, () => {
    let networksModule: NetworksModule;

    beforeEach(() => {
        networksModule = new NetworksModule();
    });

    it('should create an instance', () => {
        expect(networksModule).toBeTruthy();
    });
});
