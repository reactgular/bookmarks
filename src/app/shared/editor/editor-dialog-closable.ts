import {Observable} from 'rxjs';

export interface EditorDialogClosable {
    closed: Observable<void>;

    closing: Observable<void>;

    close(): Observable<void>;
}
