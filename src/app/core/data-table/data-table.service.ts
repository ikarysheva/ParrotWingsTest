import { Injectable, Provider, SkipSelf, Optional, Inject } from '@angular/core';

export enum DataTableSortingOrder {
    Ascending = <any>'ASC',
    Descending = <any>'DESC',
}

@Injectable()
export class DataTableService {

    /**
     * params:
     * - data: any[]
     * - searchTerm: string
     * - ignoreCase: boolean = false
     * - excludedColumns: string[] = []
     *
     * Searches [data] parameter for [searchTerm] matches and returns a new array with them.
     */
    filterData(data: any[], searchTerm: string, ignoreCase: boolean = false, excludedColumns?: string[]): any[] {
        const filter: string = searchTerm ? (ignoreCase ? searchTerm.toLowerCase() : searchTerm) : '';
        if (filter) {
            data = data.filter((item: any) => {
                const res: any = Object.keys(item).find((key: string) => {
                    if (!excludedColumns || excludedColumns.indexOf(key) === -1) {
                        const preItemValue: string = ('' + item[key]);
                        const itemValue: string = ignoreCase ? preItemValue.toLowerCase() : preItemValue;
                        return itemValue.indexOf(filter) > -1;
                    }
                });
                return !(typeof res === 'undefined');
            });
        }
        return data;
    }

    /**
     * params:
     * - data: any[]
     * - sortBy: string
     * - sortOrder: DataTableSortingOrder = DataTableSortingOrder.Ascending
     *
     * Sorts [data] parameter by [sortBy] and [sortOrder] and returns the sorted data.
     */
    sortData(data: any[], sortBy: string, sortOrder: DataTableSortingOrder = DataTableSortingOrder.Ascending): any[] {
        if (sortBy) {
            data = Array.from(data); // Change the array reference to trigger OnPush and not mutate original array
            data.sort((a: any, b: any) => {
                const compA: any = a[sortBy];
                const compB: any = b[sortBy];
                let direction = 0;
                if (!Number.isNaN(Number.parseFloat(compA)) && !Number.isNaN(Number.parseFloat(compB))) {
                    direction = Number.parseFloat(compA) - Number.parseFloat(compB);
                } else {
                    if (compA < compB) {
                        direction = -1;
                    } else if (compA > compB) {
                        direction = 1;
                    }
                }
                return direction * (sortOrder === DataTableSortingOrder.Descending ? -1 : 1);
            });
        }
        return data;
    }

    /**
     * params:
     * - data: any[]
     * - fromRow: number
     * - toRow: : number
     *
     * Returns a section of the [data] parameter starting from [fromRow] and ending in [toRow].
     */
    pageData(data: any[], fromRow: number, toRow: number): any[] {
        if (fromRow >= 1) {
            data = data.slice(fromRow - 1, toRow);
        }
        return data;
    }
}

export function DATA_TABLE_PROVIDER_FACTORY(
    parent: DataTableService): DataTableService {
    return parent || new DataTableService();
}

export const DATA_TABLE_PROVIDER: Provider = {
    // If there is already a service available, use that. Otherwise, provide a new one.
    provide: DataTableService,
    deps: [[new Optional(), new SkipSelf(), DataTableService]],
    useFactory: DATA_TABLE_PROVIDER_FACTORY,
};
