import {StateContext} from '@ngxs/store';
import {environment} from '../../../environments/environment';
import {LogService} from '../../shared/dev-tools/log/log.service';
import {EntityMap} from '../../shared/networks/entities/entity-map';
import {EntityId, EntityIdType} from '../../shared/networks/networks.types';
import {Assert} from '../../utils/assert';
import {ChangesNoopAction} from './changes-noop.action';

export class ChangesTracker<TType extends EntityId> {

    private readonly _log: LogService;

    public constructor(log: LogService,
                       private _timeStamp: boolean,
                       private _model: string) {
        this._log = log
            .withPrefix(ChangesTracker.name)
            .withPrefix(this._model);
    }

    /**
     * Gets a shallow copy of the entity from the map.
     */
    public clone(ctx: StateContext<EntityMap<TType>>, id: EntityIdType): TType {
        return {...<any>this.get(ctx, id)};
    }

    /**
     * Sets the ID of a new entity and adds it to the state store.
     */
    public create(ctx: StateContext<EntityMap<TType>>, entity: Partial<TType>): any {
        this._log.debug('create', entity);

        if (typeof entity.id === 'undefined') {
            entity.id = this.nextId(ctx.getState());
        }

        if (this._timeStamp && !entity['modified'] && !entity['created']) {
            entity = {
                modified: new Date().toISOString(),
                created: new Date().toISOString(),
                ...<any>entity
            };
        }

        const patch: any = {};
        patch[entity.id] = <any>entity;
        ctx.patchState(patch);

        return new ChangesNoopAction();
    }

    public edit(ctx: StateContext<EntityMap<TType>>, entity: Partial<TType>, persist: boolean = true): any {
        this._log.debug('edit', {entity, persist});

        if (typeof entity.id === 'undefined') {
            throw new Error('ID is required');
        }
        const hasChanges = Object.keys(entity).some(key => key !== 'id' && !key.startsWith('_'));
        if (hasChanges && this._timeStamp) {
            entity = {modified: new Date().toISOString(), ...<any>entity};
        }
        this.set(ctx, Object.assign(this.clone(ctx, entity.id), entity));
        return new ChangesNoopAction();
    }

    /**
     * Checks if an entity identifier exists in the store.
     */
    public exists(ctx: StateContext<EntityMap<TType>>, id: EntityIdType): boolean {
        return typeof ctx.getState()[id] !== 'undefined';
    }

    /**
     * Gets an entity from the storage map.
     */
    public get(ctx: StateContext<EntityMap<TType>>, id: EntityIdType): TType {
        const state = ctx.getState();
        this.mustExist(state, id);
        return state[id];
    }

    public nextId(map: EntityMap<TType>): EntityIdType {
        return Object.values(map).reduce((prev: number, item: TType) => Math.max(prev, <number>item.id), 0) + 1;
    }

    public publish(ctx: StateContext<EntityMap<TType>>, id: EntityIdType): any {
        this._log.debug('publish', {id});
        const item = {...<EntityId>this.get(ctx, id)};
        if (!item._new) {
            return new ChangesNoopAction();
        }
        delete item._new;
        const state = {...ctx.getState()};
        delete state[item.id];
        ctx.setState(state);
        return this.create(ctx, <TType>item);
    }

    public remove(ctx: StateContext<EntityMap<TType>>, id: EntityIdType, persist: boolean = true): any {
        this._log.debug('remove', {id, persist});
        const state = {...ctx.getState()};
        this.mustExist(state, id);
        delete state[id];
        ctx.setState(state);
        return new ChangesNoopAction();
    }

    public set(ctx: StateContext<EntityMap<TType>>, entity: TType) {
        if (typeof entity.id === 'undefined') {
            throw new Error('ID is required');
        }
        const patch: EntityMap<TType> = {};
        patch[entity.id] = entity;
        ctx.patchState(patch);
    }

    public toArray(ctx: StateContext<EntityMap<TType>>): TType[] {
        return Object.values(ctx.getState());
    }

    private mustExist(map: EntityMap<TType>, id: EntityIdType) {
        if (environment.debug) {
            Assert.isDefined(map[id], `${this._model}:${id} does not exists`);
        }
    }

    private mustNotExist(map: EntityMap<TType>, id: EntityIdType) {
        if (environment.debug) {
            Assert.isUndefined(map[id], `${this._model}:${id} already exists`);
        }
    }
}
