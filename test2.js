import {getData} from './test2.js';

export const someFunc = async () => {
    const data = await getData();
    console.log(data)
}