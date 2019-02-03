const oneDay =1000*60*60*24;
 /* конфигурация */
 const width = 133; // ширина изображения
 const count = 1    ; // количество изображений при пролистывании
 const countItem = 4; //количество элементов в блоке
 let root = document.documentElement;//обращение к css стилю root
 root.style.setProperty('--countItem', countItem);
 root.style.setProperty('--weatherItemWidth', width + "px");

const enrtyData = [
    {
        data: Date.now()-oneDay*2,
        temperature: {
            night: 0,
            day: 4,
        },
        cloudiness: 'Переменная облачность',
        snow: false,
        rain: true,
    },
    {
        data:Date.now()-oneDay,
        temperature: {
            night: 0,
            day: 1,
        },
        cloudiness: 'Облачно',
        snow: true,
        rain: true,
    },    
    {
        data: Date.now(),
        temperature: {
            night: -3,
            day: 2,
        },
        cloudiness: 'Ясно',
        snow: false,
        rain: false,
    },
    {
        data: Date.now()+oneDay,
        temperature: {
            night: 0,
            day: 4,
        },
        cloudiness: 'Переменная облачность',
        snow: false,
        rain: true,
    },
    {
        data:Date.now()+oneDay*2,
        temperature: {
            night: 0,
            day: 1,
        },
        cloudiness: 'Облачно',
        snow: true,
        rain: true,
    },

    {
        data: Date.now()+oneDay*3,
        temperature: {
            night: 0,
            day: 1,
        },
        cloudiness: 'Облачно',
        snow: true,
        rain: false,
    },
    {
        data:Date.now()+oneDay*4,
        temperature: {
            night: 0,
            day: 1,
        },
        cloudiness: 'Облачно',
        snow: true,
        rain: true,
    },

    {
        data: Date.now()+oneDay*5,
        temperature: {
            night: 0,
            day: 1,
        },
        cloudiness: 'Облачно',
        snow: true,
        rain: false,
    }

]

//трансформируем объект в необходимый формат для верстки
//start transformData
const transformData = (objWeather) => {
//start getDate     
//преобразуем дату из мс в день недели, число месяц
    const getDate = data => {
        //опции локализации даты
        const dateOptions = {
            month: 'long',
            weekday: "long",
            day: "numeric"
        }
        //устанавливаем границу текущего дня (начало и конец)
        const curDateStart = new Date().setHours(0, 0, 0);
        const curDateEnd = new Date().setHours(23, 59, 59, 999);

        let [day, date] = new Date(data).toLocaleString("ru", dateOptions).split(', ');
        //Если поолученая дата в диопазне текущей даты, то переопределяем день недели на "сегодня"
        if (data >= curDateStart && data <= curDateEnd) {
            day = "сегодня";            
        }
        
        return {
            day,
            date
        };
    }
    // end getDate

    //------------------------------------------------------------------ 

    //start getTemp
    //Получаем осадки  в зависимости от дождь или снег     
    const getWeather = (rain, snow) => {
        let weather = '';
        //преобразовывеам лог. переменные в числа и складываем как сторки и преобразуем из 2 в 10 систему счислений
        switch (parseInt(weather + (+rain) + (+snow), 2)) {
            case 0:
                weather = 'без осадков';
                break;
            case 1:
                weather = 'снег';
                break;
            case 2:
                weather = 'дождь';
                break;
            case 3:
                weather = 'дождь со снегом';
                break;
        }
        //возвращаем описание погоды
        return weather;
    
    }
    //---end getTemp

    //------------------------------------------------------------------

    //start getTemp
    //Получаем температуру днем или ночью  
    const getTemp = (timesOfDay, value) => {
        if (value > 0) {
            value =  `+${value}`;
        } 
        
        return timesOfDay === 'dayTemp' ?  `днём ${value}&deg` : `ночью ${value}&deg`;
    }
    //---end getTemp

    //Получаем иконку в зависимости от значения облочности
    const getImgWeather = (cloudiness) => {
        let pathToImg = '';
        
        switch (cloudiness) {           
            case 'без осадков':
                pathToImg = '../img/sun.svg';
                break;
            case 'снег':
                pathToImg = '../img/snowy.svg';
                break;
            case 'дождь':
            pathToImg = '../img/rain.svg';
                break;
            case 'дождь со снегом':
                pathToImg = '../img/rain-snow.svg';
                    break;    
        }
        //возвращаем путь к картинке
        return pathToImg;       
    }
    
    //деструктурируем полученнный объект
    const {
        data,
        temperature: {
            night: nightTemp,
            day: dayTemp
        },
        //cloudiness,
        snow,
        rain
    } = objWeather;

    //получяаем день неденли и день месяц в отдельные переменные
    const {
        day,
        date
    } = getDate(data);

    const weather = getWeather(rain, snow);
    //создаем новый объект и записываем в него свойства и значения
    const updateItem = {
        day, 
        date,
        cloudiness : getImgWeather(weather),
        dayTemp : getTemp('dayTemp', dayTemp),
        nightTemp: getTemp('nightTemp',nightTemp),           
        weather
    }
    //возвращаем объект
    return updateItem;
}
//---end transformDate

//------------------------------------------------------------------ 

//start createBlock
//создаем блок с погодой на странице  
const createBlock = (weatherItem) => {
    const blocks = document.querySelector('.blocks ul'),
        liBlock = document.createElement('li'),
        block =  document.createElement('div');
        block.classList.add('block');

    for (let item in weatherItem) {
        let childDiv = document.createElement('div');
        if (item === 'cloudiness'){            
            const img = document.createElement('img');
            img.src = weatherItem[item];            
            childDiv.appendChild(img);            
        } else {
            childDiv.innerHTML = weatherItem[item];
        }        
        childDiv.classList.add(`${item}`)
        block.appendChild(childDiv);
    }
    liBlock.appendChild(block);
    blocks.appendChild(liBlock);
}

const creatMainBlock = () => {
    const section=document.createElement('section'),
        sectionHeader = document.createElement('div'),
        sectionWrapper = document.createElement('div'),
        prevArrow = document.createElement('button'),
        nextArrow = document.createElement('button'),
        blocks = document.createElement('div'),
        ulBlock = document.createElement('ul');

    sectionHeader.classList.add('section-header');
    sectionWrapper.classList.add('slider-wrapper');
    prevArrow.classList.add('prev', 'arrow');
    blocks.classList.add('blocks');
    nextArrow.classList.add('next', 'arrow');
    sectionHeader.innerHTML='<h2>Прогноз погоды</h2>'; 
    section.appendChild(sectionHeader);
    section.appendChild(sectionWrapper);
    sectionWrapper.appendChild(prevArrow);
    sectionWrapper.appendChild(blocks);
    blocks.appendChild(ulBlock);
    sectionWrapper.appendChild(nextArrow);
    document.body.appendChild(section);
}

//оставляем только данные за сегодня и на период на три дня (не используется)
const filterData = ({data}) => {   
    const curDateStart = new Date().setHours(0, 0, 0);
    const curDateEnd = curDateStart+oneDay*4;
    return data >= curDateStart && data<=curDateEnd;
}

//ищем индекс элемента по текущей дате
const findIndex = ({data}) => {
    const curDateStart = new Date().setHours(0, 0, 0);
    const curDateEnd = new Date().setHours(23, 59, 59, 999);
    let [day, date] = new Date(data).toLocaleString("ru", dateOptions).split(', ');
    //Если поолученая дата в диопазне текущей даты, то переопределяем день недели на "сегодня"
    if (data >= curDateStart && data <= curDateEnd) {
        day = "сегодня";            
    }
}

creatMainBlock();
//преобразуем каждый переданный объект и отображаем его на странице 
const newDate = enrtyData.map(transformData).forEach(createBlock);

const sliderWrapper = document.getElementsByClassName('slider-wrapper')[0],
    list = sliderWrapper.querySelector('ul'),
    listElems = sliderWrapper.querySelectorAll('li'),
    btnPrev = sliderWrapper.querySelector('.prev'),
    btnNext = sliderWrapper.querySelector('.next');

let position = 0; // текущий сдвиг влево
const maxPosition = listElems.length * width;

btnPrev.addEventListener('click',prevSlide);
btnNext.addEventListener('click',nextSlide);


function prevSlide() {
    if (position !==  0 ) {
        position = position + width * count;
        list.style.marginLeft = position + 'px';
    }
}

function nextSlide() {
    // сдвиг вправо
    // последнее передвижение вправо может быть не на 3, а на 2 или 1 элемент
    if (maxPosition >  countItem *width - position) {  
        position = Math.max(position - width * count, -width * (maxPosition - count));
        list.style.marginLeft = position + 'px';
    }
};

let indexCurdate = enrtyData.findIndex(({data})=>{
    const curDateStart = new Date().setHours(0, 0, 0);
    const curDateEnd = new Date().setHours(23, 59, 59, 999);   
    //Если поолученая дата в диапазоне текущей даты, то переопределяем день недели на "сегодня"
    return data >= curDateStart && data <= curDateEnd;
});

//Устанавливаем текущую позицию
position = - indexCurdate * width;
list.style.marginLeft = position + 'px';