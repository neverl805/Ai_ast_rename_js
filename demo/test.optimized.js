function a(elements, tep) {
  var chunks = [];
  var length = elements.length;
  var currentIndex = 0;
  for (; currentIndex < length; currentIndex += tep) {
    if (currentIndex + tep < length) {
      chunks.push(elements.substring(currentIndex, currentIndex + tep));
    } else {
      chunks.push(elements.substring(currentIndex, length));
    }
  }
  return chunks;
}