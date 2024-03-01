import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'objectFilter'
})
export class ObjectFilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items) return [];
        if (!searchText) return items;

        searchText = searchText.toLowerCase();

        return items.filter(item => {
            // Iterate through each property of the object
            for (let key in item) {
                // Check if the property value contains the search text
                if (item[key] && item[key].toString().toLowerCase().includes(searchText)) {
                    return true; // Include the item in the filtered result
                }
            }
            return false; // Exclude the item from the filtered result
        });
    }
}
