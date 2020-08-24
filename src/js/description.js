import data from '../description.json'

const Description = () => {
   let desc = document.querySelector('.description');
   for (let list of data){
        let div = document.createElement('div');
        let span = document.createElement('span');
        span.setAttribute('class','dot');
        span.style.backgroundColor = list.color;
        div = desc.appendChild(div);
        div.appendChild(span);
        div.innerHTML += "  " + list.value;
   }
}

export default Description;