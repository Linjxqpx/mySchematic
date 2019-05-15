
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import * as <%= defaultName(actionName, camelize) %> from '../actions';

import { HttpService } from 'src/app/pages/shared/service/http.service';
import { AspnetJsonResult, AspnetJsonResultBase } from 'src/app/pages/model/aspnet-json-result';
import { _httpflow$ } from 'src/app/pages/shared/ngrx/http.ngrx';
import { _loadingWork$ } from 'src/app/pages/shared/ngrx/loading.ngrx';
import { _entry$ } from 'src/app/pages/shared/ngrx/common.ngrx';


import { of } from 'rxjs';
import { tap } from 'rxjs/operators';



@Injectable()
export class <%= classify(name) %> {


    constructor(
        private http: HttpService,
        private actions$: Actions,
        private store: Store<<%= defaultName(storeState, camelize) %>>
    ) {}

    @Effect()
    simpleDetail$ = _entry$<string>(this.actions$, 
        <%= defaultName(actionName, camelize) %>.MemberAuthActions.LOAD_DETAIL)
        .pipe(
            exhaustMap((payload: string) => {

                // 主要要做的事情 , 這邊是透過 http client 撈取資料
                const retrieve$ = this.http.get<AspnetJsonResult<ViewModel>>('result', { WarehouseID : payload });

                // 成功時將呼叫 loadDetailSuccess$ 進行後續行為
                const handleSuccess = (result: AspnetJsonResult<ViewModel>) =>
                    of(new <%= defaultName(actionName, camelize) %>.MemberAuthActions.loadDetailSuccessAction(result.element));

                // 失敗時將呼叫 loadDetailFailed$ 進行後續行為
                const handleFailed = (result: AspnetJsonResult<ViewModel>) =>
                    of(new <%= defaultName(actionName, camelize) %>.MemberAuthActions.loadDetailFailedAction(result.message));

                // 判斷是否成功或是失敗
                const consider = (result: AspnetJsonResultBase) => result.isSuccess;

                // 實際進行http 行為
                const work$ = _httpflow$(handleSuccess, handleFailed, retrieve$, consider)

                return _loadingWork$(work$);
            })

        )

    @Effect({ dispatch: false })
    simpleSuccess$ = _entry$<ViewModel>(this.actions$, 
        <%= defaultName(actionName, camelize) %>.MemberAuthActions.LOAD_DETAIL_SUCCESS).pipe(
        tap(payload => {
            
            console.log('success');
            console.log(payload)

            //swal
        })
    )


    @Effect({ dispatch: false })
    simpleFailed$ = _entry$<string>(this.actions$, 
        <%= defaultName(actionName, camelize) %>.MemberAuthActions.LOAD_DETAIL_FAILED).pipe(
        tap(payload => {
            console.log('failed');
            console.log(payload)

            //swal 
        })
    )

}