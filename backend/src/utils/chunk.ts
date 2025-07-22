// Takes an array of items and chunk the items into a matrix.
//Useful for offset based pagination.
export function chunk<T>(item: T[], chunk: number): T[][] {
    // Initialize the matrix
    const chunks: T[][] = [];

    //For loop: loops until i is more than our items available: Increment by the given chunk:
    // Each iteraction copy push targeted chunk from the passed items to the chunks array.
    for (let i = 0; i < item.length; i += chunk) {
        chunks.push(item.slice(i, i + chunk));
    }

    return chunks;
}
