import {CardsModule} from './cards.module';

describe(CardsModule.name, () => {
    let cardsModule: CardsModule;

    beforeEach(() => {
        cardsModule = new CardsModule();
    });

    it('should create an instance', () => {
        expect(cardsModule).toBeTruthy();
    });
});
