import data from '../description.json';

const Description = () => {
   const desc = document.querySelector('.description');
   data.forEach((list) => {
      let div = document.createElement('div');
      const span = document.createElement('span');
      span.setAttribute('class', 'dot');
      span.style.backgroundColor = list.color;
      div = desc.appendChild(div);
      div.appendChild(span);
      div.innerHTML += `  ${list.value}`;
   });
};

export default Description;
