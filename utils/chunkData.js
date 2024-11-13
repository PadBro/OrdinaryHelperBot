export const chunkData = (arr, amountSubChunks, lengthSubChunk) => {
  const chunks = [];

  // slices array in the ammount of chunks
  for (let i = 0; i < arr.length; i += lengthSubChunk * amountSubChunks) {
    let currentChunk = [];

    // slice the current chunk into 'amountSubChunks' subchunks where each subchunk has a length of 'lengthSubChunk'
    const chunk = arr.slice(i, i + lengthSubChunk * amountSubChunks);

    // if the current chunk has not enough data to make a complete chunk (normally only the last chunk)
    if (chunk.length < lengthSubChunk * amountSubChunks) {
      // calculate how large a subchunk can be without a rest
      const restSubChunkSize = Math.round(chunk.length / amountSubChunks);
      // avoid infinite loop if array is less than a single chunk
      if (restSubChunkSize > 0) {
        // split the current chunk into subchunks of size 'restSubChunkSize'
        for (
          let y = 0;
          y < amountSubChunks * restSubChunkSize;
          y += restSubChunkSize
        ) {
          const subsubchunk = chunk.slice(y, y + restSubChunkSize);
          currentChunk.push(subsubchunk);
        }
      }
      // get the rest of the rest sub chunks wich dont fit into a full set of subchunks
      const subsubchunkrest = chunk.slice(amountSubChunks * restSubChunkSize);
      // loop through the rest
      for (var z = 0; z < subsubchunkrest.length; z++) {
        // if array is less than a single chunk there is no currentChunk
        if (!currentChunk[z]) {
          currentChunk[z] = [];
        }
        // add the rest to the current chunk
        currentChunk[z].push(subsubchunkrest[z]);
      }
    } else {
      // full sub chunk
      // split chunk into sub chunks
      for (
        let x = 0;
        x < lengthSubChunk * amountSubChunks;
        x += lengthSubChunk
      ) {
        const subchunk = chunk.slice(x, x + lengthSubChunk);
        currentChunk.push(subchunk);
      }
    }
    chunks.push(currentChunk);
  }
  return chunks;
};
