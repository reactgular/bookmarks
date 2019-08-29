import {EntityId, EntityTimestamp} from '../networks.types';
import {DocumentEntity} from './document.entity';
import {UserSessionEntity} from './user-session.entity';

export interface UserEntity extends EntityId, EntityTimestamp {
    /**
     * Is a super user.
     */
    admin?: boolean;
    /**
     * True to force the user to change their password.
     */
    change_password: boolean;
    /**
     * Documents that belong to this user.
     */
    documents?: DocumentEntity[];
    /**
     * Verified email
     */
    email: string;
    /**
     * The current session
     */
    user_session: UserSessionEntity;
}
