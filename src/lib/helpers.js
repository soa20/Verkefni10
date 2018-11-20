export function score(total, correct, time) {
  const calculatedScore = Math.round(((correct / total) ^ 2 + correct) * total / time) * 100; // eslint-disable-line
  console.log('calculatedScore====', calculatedScore);
  return calculatedScore;
}

export function empty(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
export function el(name, ...children) {
  const element = document.createElement(name);

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child) {
        element.appendChild(child);
      }
    });
  }

  return element;
}
