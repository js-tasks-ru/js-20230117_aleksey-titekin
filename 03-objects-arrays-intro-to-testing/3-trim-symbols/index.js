/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    let trimString = '';
    
    if (typeof size == 'undefined') return string;
    if (size === 0) return '';

    [...string].reduce( (accum, char) => {

        if ((accum[0] < size) || (char !== accum[1])) {
            trimString = trimString + char; 
        };
   
        if (char === accum[1]) {
            accum[0] = accum[0] + 1;
        } else {
            accum = [1, char];
        };

        return accum;

    }, [0, '']);
   
    return trimString;
}
