/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
    let uniqArr = [];

    if (typeof arr === 'undefined') return uniqArr;

    // Старый вариант
    /*
    arr.forEach( item => {
      if (!uniqArr.includes(item)) {
        uniqArr.push(item);
      }
    });  
    */

    // Новый вариант через SET 

    uniqArr = [...(new Set(arr))];

    return  uniqArr;
}
