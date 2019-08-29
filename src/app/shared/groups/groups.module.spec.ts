import {GroupsModule} from './groups.module';

describe(GroupsModule.name, () => {
    let groupsModule: GroupsModule;

    beforeEach(() => {
        groupsModule = new GroupsModule();
    });

    it('should create an instance', () => {
        expect(groupsModule).toBeTruthy();
    });
});
