/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    let sortedArray = arr.slice();
    sortedArray.sort((a,b)=> {
      if (a[0].toLowerCase() === b[0].toLowerCase()) {
        return b[0].localeCompare(a[0], 'ru');
      }
      return a.localeCompare(b, 'ru'); 
    });
                   
    if (param === 'desc') {
        sortedArray.reverse();
    }
    return sortedArray;
}
