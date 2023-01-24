/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    const sortedArray = [...arr];

    /* Вариант 1 
    const asc = param === 'asc' ? 1 : -1;  
    sortedArray.sort((a,b)=> {
      return asc *  a.localeCompare(b, 'ru', {caseFirst: 'upper'});  
    });
    */

    /* Вариант 2 */
    sortedArray.sort((a,b)=> {
      if (param === 'desc') [b,a] = [a,b];
      return a.localeCompare(b, 'ru', {caseFirst: 'upper'});  
    });
    
    return sortedArray;
}
